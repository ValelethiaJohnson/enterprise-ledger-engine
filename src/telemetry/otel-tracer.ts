export interface LedgerSpanAttributes {
  journalId: string;
  legCount: number;
  isolationLevel: 'SERIALIZABLE';
  lockWaitDurationMs: number;
}

export class LedgerTelemetryTracer {
  public static formatSpanTags(attrs: LedgerSpanAttributes): Record<string, string | number> {
    return {
      'fintech.ledger.journal_id': attrs.journalId,
      'fintech.ledger.leg_count': attrs.legCount,
      'db.postgresql.isolation_level': attrs.isolationLevel,
      'fintech.ledger.lock_wait_ms': attrs.lockWaitDurationMs,
    };
  }
}
