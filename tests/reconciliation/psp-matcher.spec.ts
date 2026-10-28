import { describe, it, expect } from 'vitest';
import { ThreeWayReconciliationEngine } from '../../src/reconciliation/psp-settlement-matcher';

describe('Three-Way Settlement Reconciliation Suite', () => {
  it('flags single-cent settlement drift between ledger, PSP, and bank wire', () => {
    const matched = ThreeWayReconciliationEngine.reconcileRecord({
      referenceId: 'settle_01',
      ledgerAmountMinorUnits: 97000n,
      pspGrossMinusFeeMinorUnits: 97000n,
      bankSettlementMinorUnits: 97000n,
    });
    expect(matched.status).toBe('MATCHED');

    const drifted = ThreeWayReconciliationEngine.reconcileRecord({
      referenceId: 'settle_02',
      ledgerAmountMinorUnits: 97000n,
      pspGrossMinusFeeMinorUnits: 96999n,
      bankSettlementMinorUnits: 96999n,
    });
    expect(drifted.status).toBe('DISCREPANCY_DETECTED');
    expect(drifted.ledgerVsPspDelta).toBe(1n);
  });
});
