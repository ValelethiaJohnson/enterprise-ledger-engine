# Enterprise Ledger Engine Incident Runbook

## Severity 1: Zero-Sum Invariant Breach Detected
1. **Trigger:** Automated reconciliation pipeline identifies non-zero balance: $\sum \text{Debits} \ne \sum \text{Credits}$.
2. **Immediate Action:** The engine automatically halts write pipelines via circuit breaker and emits a Critical PagerDuty alert.
3. **Investigation:** Query the Merkle batch root to identify the exact ledger sequence mismatch.
4. **Remediation:** Quarantine invalid journal entries and issue correcting compensating postings. Never alter committed rows manually.
