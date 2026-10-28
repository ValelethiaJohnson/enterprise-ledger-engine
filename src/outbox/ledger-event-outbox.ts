import crypto from 'crypto';

export interface LedgerOutboxMessage {
  messageId: string;
  journalId: string;
  topic: 'ledger.journal.committed' | 'ledger.reconciliation.alert';
  serializedPayload: string;
  partitionKey: string;
  createdAtIso: string;
}

export class LedgerTransactionalOutbox {
  public static buildOutboxEnvelope(
    journalId: string,
    primaryAccountId: string,
    payload: Record<string, unknown>
  ): LedgerOutboxMessage {
    return {
      messageId: crypto.randomUUID(),
      journalId,
      topic: 'ledger.journal.committed',
      serializedPayload: JSON.stringify(payload),
      partitionKey: primaryAccountId,
      createdAtIso: new Date().toISOString(),
    };
  }
}
