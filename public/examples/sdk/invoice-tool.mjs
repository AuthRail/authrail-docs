import { createHash } from 'node:crypto';

/** Run inside your application, after its own authentication and task lookup. */
export function createInvoiceTool({ client, organisationId, operationVersionId, invoices }) {
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  return async function handleInvoiceTool(session, task, proposal) {
    if (!session || session.organisationId !== organisationId ||
        !session.userId || !session.sessionId || !task ||
        task.organisationId !== organisationId || task.userId !== session.userId ||
        typeof task.requestKey !== 'string' || !/^[A-Za-z0-9_-]{1,96}$/.test(task.requestKey)) {
      throw new Error('Authenticated task context required');
    }
    if (!object(proposal) || Object.keys(proposal).sort().join(',') !== 'arguments,tool' ||
        proposal.tool !== 'read_invoice' || !object(proposal.arguments) ||
        Object.keys(proposal.arguments).join(',') !== 'invoiceId' ||
        typeof proposal.arguments.invoiceId !== 'string' ||
        !/^[A-Za-z0-9_-]{1,96}$/.test(proposal.arguments.invoiceId)) {
      throw new Error('Invalid invoice tool request');
    }
    const invoiceId = proposal.arguments.invoiceId;
    if (task.invoiceId !== invoiceId) throw new Error('Request does not match the saved task');
    // Snapshot trusted identity before awaiting the SDK; arguments cannot select it.
    const userId = session.userId;
    const sessionId = session.sessionId;
    const requestKey = task.requestKey;
    const actionKey = `invoice:${createHash('sha256')
      .update([organisationId, userId, requestKey].join('\0')).digest('hex')}`;
    const readOwnedInvoice = () => {
      const row = invoices.get(invoiceId);
      if (!row || row.organisationId !== organisationId || row.ownerId !== userId ||
          row.invoiceId !== invoiceId || typeof row.status !== 'string') {
        throw new Error('Invoice unavailable to this caller');
      }
      return { invoiceId: row.invoiceId, status: row.status };
    };
    readOwnedInvoice(); // Ownership lookup is application authorization, before Runtime.
    const checked = await client.enforce({
      operationVersionId,
      actionKey,
      principalId: userId,
      sessionId,
      principalSource: 'application_session',
      resourceId: invoiceId,
      resourceSource: 'application_lookup',
    }, { invoiceId }, async checkedArgs => {
      if (checkedArgs.invoiceId !== invoiceId) throw new Error('Invoice binding changed');
      // Recheck access at execution and return only the declared public fields.
      return readOwnedInvoice();
    });
    return { status: 'completed', actionId: checked.callDecision.actionId, invoice: checked.result };
  };
}
