## Ledger Mutation Architectural Summary
Describe the scope and ledger invariants impacted by this pull request.

## Financial Ledger Invariant Gates
- [ ] **Zero-Sum Balance:** $\sum \text{Debits} - \sum \text{Credits} = 0$ in minor integer units.
- [ ] **Append-Only Immutability:** No direct `UPDATE` or `DELETE` executions on ledger transaction records.
- [ ] **Idempotent Posting:** Every journal entry mandates a unique client/origin `idempotency_key`.
- [ ] **Concurrency Safe:** Account balance mutations acquire pessimistic row-level locks (`SELECT ... FOR UPDATE`).
- [ ] **Test Coverage:** Zero-sum invariant and rollback tests pass with 100% coverage.
