import asyncio
import json
import os
import re
import sys
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from authrail import (
    ApprovalContinuation, AsyncEnforceClient, EnforceBlockedError,
    EnforceOutcomeUnknownError, Operation,
)


# A single-operator, single-host example. These identities come from the application.
async def main():
    os.umask(0o077)
    args = sys.argv[1:]
    if not args or args[0] not in {"submit", "resume", "recover-permit", "status"}:
        raise ValueError("Use submit INVOICE_ID REQUEST_KEY | resume REQUEST_KEY | recover-permit REQUEST_KEY | status REQUEST_KEY")
    command = args[0]
    if len(args) != (3 if command == "submit" else 2):
        raise ValueError("Wrong number of command arguments")
    invoice_id = args[1] if command == "submit" else None
    request_key = args[2] if command == "submit" else args[1]
    if not re.fullmatch(r"[a-zA-Z0-9_-]{1,64}", request_key):
        raise ValueError("Invalid request key")
    if invoice_id is not None and not re.fullmatch(r"invoice_[a-zA-Z0-9_-]{1,64}", invoice_id):
        raise ValueError("Invalid invoice identifier")
    private = Path.home() / ".local/share/authrail/my-deployment"
    connection = json.loads((private / "connection.json").read_text())
    settings = json.loads((private / "example-config.json").read_text())
    # This private catalogue maps identifiers to fixed files, never model-written paths.
    catalogue = {"invoice_123": "invoice.json", "invoice_456": "invoice-denied.json"}

    def lookup_invoice(identifier):
        if identifier not in catalogue:
            raise ValueError("Invoice is outside this sample catalogue")
        invoice = json.loads((private / catalogue[identifier]).read_text())
        if invoice != {"invoiceId": identifier, "status": "open"}:
            raise ValueError("Invoice fixture does not match this request")
        return {"invoiceId": invoice["invoiceId"], "status": invoice["status"]}

    binding = {
        "organisationId": connection["organisationId"], "deploymentId": connection["deploymentId"],
        "operationVersionId": settings["operation_version_id"],
        "principalId": "staff_123", "sessionId": "task_123", "requestKey": request_key,
    }
    associated_data = json.dumps(binding, sort_keys=True).encode()
    directory = private / "python-invoice-tasks"
    directory.mkdir(mode=0o700, parents=True, exist_ok=True)
    metadata = directory.stat()
    if metadata.st_mode & 0o077 or metadata.st_uid != os.getuid():
        raise ValueError("Task directory must be private and owned by this application user")
    key_path = directory / "journal-key"
    try:
        with key_path.open("xb") as file:
            file.write(os.urandom(32))
            file.flush()
            os.fsync(file.fileno())
    except FileExistsError:
        pass
    encryption = AESGCM(key_path.read_bytes())
    task_path = directory / f"{request_key}.json.enc"
    lock = directory / f"{request_key}.lock"
    lock.mkdir(mode=0o700)  # A crash-left lock needs operator inspection, not automatic removal.
    task = {}

    def save():
        nonce = os.urandom(12)
        encrypted = nonce + encryption.encrypt(nonce, json.dumps(task).encode(), associated_data)
        temporary = directory / f"{request_key}.{os.urandom(8).hex()}.tmp"
        with temporary.open("xb") as file:
            file.write(encrypted)
            file.flush()
            os.fsync(file.fileno())
        temporary.replace(task_path)
        descriptor = os.open(directory, os.O_RDONLY)
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)

    try:
        if command == "submit":
            if task_path.exists():
                raise ValueError("This request key already exists; inspect its status")
            if invoice_id not in catalogue:
                raise ValueError("Invoice is outside this sample catalogue")
            task = {"binding": binding, "status": "prepared", "input": {"invoiceId": invoice_id}}
            save()
        else:
            encrypted = task_path.read_bytes()
            task = json.loads(encryption.decrypt(encrypted[:12], encrypted[12:], associated_data))
            if task["binding"] != binding:
                raise ValueError("Task binding changed")
        if command == "status":
            print("Saved task:", task["status"])
            return
        async with AsyncEnforceClient(
            sidecar_url="http://127.0.0.1:7078", organisation_id=connection["organisationId"],
            deployment_id=connection["deploymentId"],
            adapter_token=(private / "adapter-token").read_text().strip(),
            executor_private_key=(private / "executor-private.pem").read_bytes(),
        ) as client:
            async def read_invoice(checked, execution):
                if checked["invoiceId"] != task["input"]["invoiceId"]:
                    raise ValueError("Checked input changed")
                task["status"] = "started"
                task["recovery"] = execution.as_dict()
                save()  # Save the attempt before invoking the protected function.
                print("Protected reader invoked")
                return await asyncio.to_thread(lookup_invoice, checked["invoiceId"])

            try:
                if command == "submit":
                    operation = Operation(
                        version_id=binding["operationVersionId"], action_key=f"invoice-{request_key}",
                        principal_id=binding["principalId"], session_id=binding["sessionId"],
                        resource_id=task["input"]["invoiceId"], principal_source="application_session",
                        resource_source="application_lookup",
                    )
                    result = await client.enforce(operation, task["input"], read_invoice)
                else:
                    expected = "awaiting_approval" if command == "resume" else "claiming"
                    if task["status"] != expected or "continuation" not in task:
                        raise ValueError("Task is not in the required approval state; inspect instead of retrying")
                    continuation = ApprovalContinuation.from_dict(task["continuation"])
                    task["status"] = "claiming"
                    save()
                    if command == "resume":
                        result = await client.resume_approval_from(continuation, read_invoice)
                    else:
                        result = await client.recover_approval_from(continuation, read_invoice)
                task["status"] = "completed"
                save()
                print("Invoice status:", result.result["status"])
                print("result", result.result_decision.outcome, result.result_decision.recording_status)
                print("Action:", result.result_decision.action_id)
            except EnforceBlockedError as blocked:
                if blocked.approval_continuation is not None and task["status"] == "prepared":
                    task["continuation"] = blocked.approval_continuation.as_dict()
                    task["status"] = "awaiting_approval"
                elif blocked.effect_may_have_occurred:
                    task["status"] = "result_withheld"
                elif task["status"] == "prepared":
                    task["status"] = "blocked"
                save()
                outcome = blocked.decision.outcome if blocked.decision else "unavailable"
                print("Saved task:", task["status"], "| check:", blocked.phase, outcome)
                if blocked.decision is not None:
                    print("Action:", blocked.decision.action_id)
            except EnforceOutcomeUnknownError as unknown:
                task["status"] = "outcome_unknown"
                task["recovery"] = unknown.recovery.as_dict()
                save()
                print("Saved task: outcome_unknown; inspect the original attempt before further work")
    finally:
        lock.rmdir()


if __name__ == "__main__":
    asyncio.run(main())
