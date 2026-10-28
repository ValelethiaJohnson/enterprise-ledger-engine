# ADR 0003: Deadlock Elimination via Lexicographical Lock Ordering

* **Status:** Accepted
* **Date:** 2026-10-25
* **Decision Maker:** Valelethia Johnson (Principal FinTech Architect)

## Context
When Transaction A transfers funds from Account 1 to Account 2 simultaneously while Transaction B transfers from Account 2 to Account 1, acquiring row locks in posting order causes a classic circular-wait database deadlock.

## Decision
All account IDs participating in a multi-legged journal entry are deduplicated and sorted in strict ascending lexicographical order before issuing `SELECT ... FOR UPDATE NOWAIT`.

## Consequences
* **Positive:** Mathematically breaks Coffman's circular-wait condition, guaranteeing zero deadlocks across arbitrary multi-party transfers.
* **Negative:** Requires upfront collection of all participating account IDs prior to opening the lock statement.
