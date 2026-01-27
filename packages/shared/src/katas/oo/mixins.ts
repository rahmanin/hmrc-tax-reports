export type AuditInfo = {
  auditedAt: Date;
};

export const withAuditInfo = <T extends object>(base: T) => ({
  ...base,
  auditedAt: new Date(),
});

export const withValidation = <T extends { net(): number }>(base: T) => ({
  ...base,
  isValid() {
    return base.net() >= 0;
  },
});
