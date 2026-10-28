import { describe, it, expect } from 'vitest';
import { EscrowHoldEngine } from '../../src/escrow/hold-capture-engine';

describe('Two-Phase Escrow Hold & Partial Capture Suite', () => {
  it('preserves total funds conservation across hold and partial capture transitions', () => {
    const initial = { availableMinorUnits: 100000n, encumberedMinorUnits: 0n, settledMinorUnits: 0n };
    const afterHold = EscrowHoldEngine.placeHold(initial, 40000n);

    expect(afterHold.availableMinorUnits).toBe(60000n);
    expect(afterHold.encumberedMinorUnits).toBe(40000n);

    const afterPartialCapture = EscrowHoldEngine.captureHold(afterHold, 40000n, 35000n);
    expect(afterPartialCapture.availableMinorUnits).toBe(65000n);
    expect(afterPartialCapture.encumberedMinorUnits).toBe(0n);
    expect(afterPartialCapture.settledMinorUnits).toBe(35000n);
  });
});
