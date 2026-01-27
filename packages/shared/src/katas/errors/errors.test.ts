import { describe, it, expect } from 'vitest';
import { AppError, ValidationError, ExternalServiceError } from './errors';

describe('kata: shared error shapes', () => {
  it('AppError is serializable and safe', () => {
    const err = new AppError({
      code: 'TEST_ERROR',
      message: 'Something went wrong',
      details: { internal: 'stacktrace or raw data' },
    });

    const json = JSON.stringify(err);

    expect(json).toContain('TEST_ERROR');
    expect(json).toContain('Something went wrong');
    expect(json).toContain('internal');
  });

  it('ValidationError has stable code', () => {
    const err = new ValidationError('Invalid draft');

    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('Validation failed: Invalid draft');
  });

  it('ExternalServiceError hides internal details', () => {
    const err = new ExternalServiceError('HMRC', {
      status: 500,
      raw: 'connection reset',
    });

    expect(err.code).toBe('EXTERNAL_SERVICE_ERROR');
    expect(err.message).toBe('External service failed: HMRC');

    const json = err.toJSON();
    expect(json.details).toBeDefined();
  });
});
