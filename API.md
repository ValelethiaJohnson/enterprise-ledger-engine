# Enterprise Ledger Engine API Specification

## 1. Post Balanced Journal Entry
`POST /api/v1/ledger/journals`

### Mandatory Headers
* `Idempotency-Key`: `UUIDv4` unique transaction identifier.
* `X-Ledger-Signature`: `HMAC-SHA256` cryptographic request digest.

### Request Payload
```json
{
  "referenceId": "ord_9981273",
  "currency": "USD",
  "postings": [
    { "accountId": "acc_buyer_01", "direction": "DEBIT", "amountMinorUnits": "25000" },
    { "accountId": "acc_merchant_88", "direction": "CREDIT", "amountMinorUnits": "24250" },
    { "accountId": "acc_platform_revenue", "direction": "CREDIT", "amountMinorUnits": "750" }
  ]
}
