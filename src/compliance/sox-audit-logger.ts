const REDACTED_FIELDS = new Set(['taxId', 'ssn', 'iban', 'routingNumber', 'apiKey']);

export class SoxComplianceAuditLogger {
  public static sanitizeAuditMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (REDACTED_FIELDS.has(key)) {
        clean[key] = '[REDACTED_SOX_PII]';
      } else {
        clean[key] = value;
      }
    }
    return clean;
  }
}
