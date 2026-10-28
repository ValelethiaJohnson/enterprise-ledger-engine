# Enterprise Immutable Ledger Engine

![Ledger CI Pipeline](https://img.shields.io/badge/Ledger_CI_Pipeline-passing-success?style=flat-square&logo=githubactions)
![License Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)
![TypeScript 5.6 Strict](https://img.shields.io/badge/TypeScript-5.6_Strict-3178C6?style=flat-square&logo=typescript)
![Database PostgreSQL Serializable](https://img.shields.io/badge/Database-PostgreSQL_Serializable-336791?style=flat-square&logo=postgresql)

An enterprise-grade immutable double-entry ledger engine featuring cryptographic audit trails, zero-sum balance invariants, and high-performance reconciliation pipelines.

---

## 📊 Core Ledger Posting & Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Service as Checkout / Payment Service
    participant API as Ledger Ingestion API
    participant Lock as Account Lock Manager
    participant DB as PostgreSQL (Append-Only)
    participant Merkle as Merkle Tree Sealer

    Service->>API: Post Multi-Party Journal Entry (Idempotency Key)
    API->>Lock: Acquire Ordered Row Locks (Prevent Deadlocks)
    API->>API: Verify Zero-Sum Invariant (Debits == Credits)
    API->>DB: INSERT Immutable Journal Postings
    API->>Merkle: Compute SHA-256 Batch Root
    Merkle-->>API: Cryptographic Batch Receipt
    API-->>Service: 201 Created (Sealed Transaction Receipt)
