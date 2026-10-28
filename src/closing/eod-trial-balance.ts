export interface TrialBalanceRow {
  accountId: string;
  totalDebitMinorUnits: bigint;
  totalCreditMinorUnits: bigint;
}

export interface TrialBalanceCertificate {
  accountingDate: string;
  aggregateDebits: bigint;
  aggregateCredits: bigint;
  isBalanced: boolean;
  accountCount: number;
}

export class EndOfDayTrialBalanceEngine {
  public static generateTrialBalance(
    accountingDate: string,
    rows: ReadonlyArray<TrialBalanceRow>
  ): TrialBalanceCertificate {
    let aggregateDebits = 0n;
    let aggregateCredits = 0n;

    for (const row of rows) {
      aggregateDebits += row.totalDebitMinorUnits;
      aggregateCredits += row.totalCreditMinorUnits;
    }

    return {
      accountingDate,
      aggregateDebits,
      aggregateCredits,
      isBalanced: aggregateDebits === aggregateCredits,
      accountCount: rows.length,
    };
  }
}
