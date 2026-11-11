import hashlib
import re

from authrail import Operation


def create_invoice_tool(client, organisation_id, operation_version_id, invoices):
    """Invoke only with server-authenticated context and an application-owned task."""
    async def handle(session, task, proposal):
        if (not isinstance(session, dict) or not isinstance(task, dict)
                or session.get("organisationId") != organisation_id
                or not session.get("userId") or not session.get("sessionId")
                or task.get("organisationId") != organisation_id
                or task.get("userId") != session["userId"]):
            raise ValueError("Authenticated task context required")
        request_key = task.get("requestKey")
        if not isinstance(request_key, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,96}", request_key):
            raise ValueError("Invalid saved task key")
        if (not isinstance(proposal, dict) or set(proposal) != {"tool", "arguments"}
                or proposal["tool"] != "read_invoice"
                or not isinstance(proposal["arguments"], dict)
                or set(proposal["arguments"]) != {"invoiceId"}):
            raise ValueError("Invalid invoice tool request")
        invoice_id = proposal["arguments"]["invoiceId"]
        if (not isinstance(invoice_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,96}", invoice_id)
                or task.get("invoiceId") != invoice_id):
            raise ValueError("Request does not match the saved task")
        user_id, session_id = session["userId"], session["sessionId"]
        action_key = "invoice:" + hashlib.sha256(
            "\0".join((organisation_id, user_id, request_key)).encode("utf-8")
        ).hexdigest()

        def read_owned_invoice():
            row = invoices.get(invoice_id)
            if (not isinstance(row, dict) or row.get("organisationId") != organisation_id
                    or row.get("ownerId") != user_id or row.get("invoiceId") != invoice_id
                    or not isinstance(row.get("status"), str)):
                raise ValueError("Invoice unavailable to this caller")
            return {"invoiceId": row["invoiceId"], "status": row["status"]}

        read_owned_invoice()
        operation = Operation(
            version_id=operation_version_id,
            action_key=action_key,
            principal_id=user_id, session_id=session_id,
            principal_source="application_session",
            resource_id=invoice_id, resource_source="application_lookup",
        )

        async def read(checked, execution):
            if checked["invoiceId"] != invoice_id:
                raise ValueError("Invoice binding changed")
            return read_owned_invoice()

        checked = await client.enforce(operation, {"invoiceId": invoice_id}, read)
        return {"status": "completed", "actionId": checked.call_decision.action_id,
                "invoice": checked.result}
    return handle
