export interface ThreeWayRecord {
  referenceId: string;
  ledgerAmountMinorUnits: bigint;
  pspGrossMinusFeeMinorUnits: bigint;
  bankSettlementMinorUnits: bigint;
}

export interface ReconciliationResult {
  referenceId: string;
  status: 'MATCHED' | 'DISCREPANCY_DETECTED';
  ledgerVsPspDelta: bigint;
  pspVsBankDelta: bigint;
}

export class ThreeWayReconciliationEngine {
  public static reconcileRecord(record: ThreeWayRecord): ReconciliationResult {
    const ledgerVsPspDelta = record.ledgerAmountMinorUnits - record.pspGrossMinusFeeMinorUnits;
    const pspVsBankDelta = record.pspGrossMinusFeeMinorUnits - record.bankSettlementMinorUnits;
    const isMatched = ledgerVsPspDelta === 0n && pspVsBankDelta === 0n;

    return {
      referenceId: record.referenceId,
      status: isMatched ? 'MATCHED' : 'DISCREPANCY_DETECTED',
      ledgerVsPspDelta,
      pspVsBankDelta,
    };
  }
}
