export class SerializationConflictCircuitBreaker {
  private consecutiveConflicts = 0;

  constructor(private readonly maxConflictsThreshold = 10) {}

  public recordConflict(): void {
    this.consecutiveConflicts += 1;
  }

  public recordCommitSuccess(): void {
    this.consecutiveConflicts = 0;
  }

  public isTripped(): boolean {
    return this.consecutiveConflicts >= this.maxConflictsThreshold;
  }
}
