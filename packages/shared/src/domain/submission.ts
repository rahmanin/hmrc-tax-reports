export type SubmissionState =
  | { kind: 'IDLE' }
  | { kind: 'SUBMITTING'; attempt: number; startedAt: string }
  | { kind: 'SUBMITTED'; receiptId: string; submittedAt: string }
  | { kind: 'FAILED'; code: 'TIMEOUT' | 'HMRC_500' | 'VALIDATION'; message: string };
