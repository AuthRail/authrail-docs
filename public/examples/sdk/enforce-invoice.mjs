import { readFile, mkdir, open, rename, rm, stat } from 'node:fs/promises';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { EnforceClient, EnforceBlockedError, EnforceOutcomeUnknownError } from '@authrail/sdk-node';

// A single-operator, single-host example. The agent never supplies these identities.
process.umask(0o077);
const args = process.argv.slice(2);
const [command, first, second] = args;
const invoiceId = command === 'submit' ? first : null;
const requestKey = command === 'submit' ? second : first;
if (args.length !== (command === 'submit' ? 3 : 2) ||
    !['submit', 'resume', 'recover-permit', 'status'].includes(command) ||
    !/^[a-zA-Z0-9_-]{1,64}$/.test(requestKey ?? '') ||
    (command === 'submit' && !/^invoice_[a-zA-Z0-9_-]{1,64}$/.test(invoiceId ?? ''))) {
  throw new Error('Usage: submit INVOICE_ID REQUEST_KEY | resume REQUEST_KEY | recover-permit REQUEST_KEY | status REQUEST_KEY');
}
const privateDirectory = join(homedir(), '.local/share/authrail/my-deployment');
const readPrivate = (name) => readFile(join(privateDirectory, name), 'utf8');
const connection = JSON.parse(await readPrivate('connection.json'));
const settings = JSON.parse(await readPrivate('example-config.json'));
// A private application-owned catalogue resolves tool input; it is not a path from the agent.
const catalogue = new Map([['invoice_123', 'invoice.json'], ['invoice_456', 'invoice-denied.json']]);
async function lookupInvoice(id) {
  const filename = catalogue.get(id);
  if (!filename) throw new Error('Invoice is outside this sample catalogue');
  const invoice = JSON.parse(await readPrivate(filename));
  if (invoice === null || typeof invoice !== 'object' || Array.isArray(invoice) ||
      Object.keys(invoice).length !== 2 || invoice.invoiceId !== id || invoice.status !== 'open') {
    throw new Error('Invoice fixture does not match this request');
  }
  return { invoiceId: invoice.invoiceId, status: invoice.status };
}
const binding = {
  organisationId: connection.organisationId,
  deploymentId: connection.deploymentId,
  operationVersionId: settings.operation_version_id,
  principalId: 'staff_123', sessionId: 'task_123', requestKey,
};
const associatedData = Buffer.from(JSON.stringify(binding));
const directory = join(privateDirectory, 'node-invoice-tasks');
await mkdir(directory, { recursive: true, mode: 0o700 });
const metadata = await stat(directory);
if ((metadata.mode & 0o077) !== 0 || metadata.uid !== process.getuid()) {
  throw new Error('Task directory must be private and owned by this application user');
}
const keyPath = join(directory, 'journal-key');
try {
  const keyFile = await open(keyPath, 'wx', 0o600);
  try { await keyFile.writeFile(randomBytes(32)); await keyFile.sync(); }
  finally { await keyFile.close(); }
} catch (error) { if (error.code !== 'EEXIST') throw error; }
const key = await readFile(keyPath);
if (key.length !== 32) throw new Error('Invalid task encryption key');
const taskPath = join(directory, `${requestKey}.json.enc`);
const lockPath = join(directory, `${requestKey}.lock`);
await mkdir(lockPath, { mode: 0o700 }); // An existing or crash-left lock needs operator inspection.
let task;
async function save() {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, nonce);
  cipher.setAAD(associatedData);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(task)), cipher.final()]);
  const temporary = `${taskPath}.${randomBytes(8).toString('hex')}.tmp`;
  const file = await open(temporary, 'wx', 0o600);
  try { await file.writeFile(Buffer.concat([nonce, cipher.getAuthTag(), encrypted])); await file.sync(); }
  finally { await file.close(); }
  await rename(temporary, taskPath);
  const parent = await open(directory, 'r');
  try { await parent.sync(); } finally { await parent.close(); }
}
async function load() {
  const encrypted = await readFile(taskPath);
  const decipher = createDecipheriv('aes-256-gcm', key, encrypted.subarray(0, 12));
  decipher.setAAD(associatedData);
  decipher.setAuthTag(encrypted.subarray(12, 28));
  const saved = JSON.parse(Buffer.concat([decipher.update(encrypted.subarray(28)), decipher.final()]).toString());
  if (JSON.stringify(saved.binding) !== JSON.stringify(binding)) throw new Error('Task binding changed');
  return saved;
}
try {
  if (command === 'submit') {
    try { await stat(taskPath); throw new Error('This request key already exists; inspect its status'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (!catalogue.has(invoiceId)) throw new Error('Invoice is outside this sample catalogue');
    const target = { invoiceId };
    task = { binding, status: 'prepared', input: { invoiceId: target.invoiceId }, operation: {
      operationVersionId: binding.operationVersionId,
      actionKey: `invoice-${requestKey}`, principalId: binding.principalId,
      sessionId: binding.sessionId, resourceId: target.invoiceId,
      principalSource: 'application_session', resourceSource: 'application_lookup',
    } };
    await save();
  } else { task = await load(); }
  if (command === 'status') { console.log('Saved task:', task.status); }
  else {
    const client = new EnforceClient({
      sidecarUrl: 'http://127.0.0.1:7078', organisationId: connection.organisationId,
      deploymentId: connection.deploymentId, adapterToken: (await readPrivate('adapter-token')).trim(),
      executorPrivateKey: await readPrivate('executor-private.pem'),
    });
    async function readInvoice(checked, execution) {
      if (checked.invoiceId !== task.input.invoiceId) throw new Error('Checked input changed');
      // Save the attempt before invoking the protected function, even for this harmless read.
      task.status = 'started'; task.recovery = execution; await save();
      console.log('Protected reader invoked');
      return lookupInvoice(checked.invoiceId);
    }
    try {
      let checked;
      if (command === 'submit') checked = await client.enforce(task.operation, task.input, readInvoice);
      else {
        if (!task.continuation || (command === 'resume' ? task.status !== 'awaiting_approval' : task.status !== 'claiming')) {
          throw new Error('Task is not in the required approval state; inspect it instead of retrying');
        }
        task.status = 'claiming'; await save();
        checked = command === 'resume'
          ? await client.resumeApprovalFrom(task.continuation, readInvoice)
          : await client.recoverApprovalFrom(task.continuation, readInvoice);
      }
      task.status = 'completed'; await save();
      console.log('Invoice status:', checked.result.status);
      console.log('result', checked.resultDecision.outcome, checked.resultDecision.recordingStatus);
      console.log('Action:', checked.resultDecision.actionId);
    } catch (error) {
      if (error instanceof EnforceBlockedError) {
        if (error.approvalContinuation && task.status === 'prepared') {
          task.continuation = error.approvalContinuation; task.status = 'awaiting_approval';
        } else if (error.effectMayHaveOccurred) task.status = 'result_withheld';
        else if (task.status === 'prepared') task.status = 'blocked';
        await save();
        console.log('Saved task:', task.status, '| check:', error.phase, error.decision?.outcome ?? 'unavailable');
        if (error.decision?.actionId) console.log('Action:', error.decision.actionId);
      } else if (error instanceof EnforceOutcomeUnknownError) {
        task.status = 'outcome_unknown'; task.recovery = error.recovery ?? task.recovery; await save();
        console.log('Saved task: outcome_unknown; inspect the original attempt before further work');
      } else { throw error; }
    }
  }
} finally { await rm(lockPath, { recursive: true }); }
