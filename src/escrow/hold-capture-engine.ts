export interface AccountCompartments {
  availableMinorUnits: bigint;
  encumberedMinorUnits: bigint;
  settledMinorUnits: bigint;
}

export class EscrowHoldEngine {
  public static placeHold(state: AccountCompartments, holdAmount: bigint): AccountCompartments {
    if (holdAmount <= 0n) {
      throw new Error('Hold amount must be strictly positive');
    }
    if (state.availableMinorUnits < holdAmount) {
      throw new Error('Insufficient available balance to place funds hold');
    }
    return {
      availableMinorUnits: state.availableMinorUnits - holdAmount,
      encumberedMinorUnits: state.encumberedMinorUnits + holdAmount,
      settledMinorUnits: state.settledMinorUnits,
    };
  }

  public static captureHold(
    state: AccountCompartments,
    originalHoldAmount: bigint,
    captureAmount: bigint
  ): AccountCompartments {
    if (captureAmount <= 0n || captureAmount > originalHoldAmount) {
      throw new Error('Capture amount must be positive and not exceed original hold');
    }
    const releasedRemainder = originalHoldAmount - captureAmount;
    return {
      availableMinorUnits: state.availableMinorUnits + releasedRemainder,
      encumberedMinorUnits: state.encumberedMinorUnits - originalHoldAmount,
      settledMinorUnits: state.settledMinorUnits + captureAmount,
    };
  }
}
