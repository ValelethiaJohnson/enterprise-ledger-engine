export interface FxPosition {
  currency: string;
  foreignBalanceMinorUnits: bigint;
  historicalFunctionalMinorUnits: bigint;
}

export interface RevaluationAdjustment {
  currency: string;
  markToMarketFunctionalMinorUnits: bigint;
  unrealizedGainLossMinorUnits: bigint;
  adjustmentDirection: 'GAIN_CREDIT' | 'LOSS_DEBIT' | 'NEUTRAL';
}

export class MultiCurrencyRevaluationEngine {
  public static computeUnrealizedGainLoss(
    position: FxPosition,
    closingRateScaled: bigint,
    rateScaleFactor = 1000000n
  ): RevaluationAdjustment {
    const currentFunctionalValue =
      (position.foreignBalanceMinorUnits * closingRateScaled) / rateScaleFactor;
    const delta = currentFunctionalValue - position.historicalFunctionalMinorUnits;

    return {
      currency: position.currency,
      markToMarketFunctionalMinorUnits: currentFunctionalValue,
      unrealizedGainLossMinorUnits: delta,
      adjustmentDirection: delta > 0n ? 'GAIN_CREDIT' : delta < 0n ? 'LOSS_DEBIT' : 'NEUTRAL',
    };
  }
}
