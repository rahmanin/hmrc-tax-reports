export type AppErrorShape = Readonly<{
  code: string;
  message: string;      // safe message
  details?: unknown;    // for logs only
}>;

export class AppError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor(shape: AppErrorShape) {
    super(shape.message);
    this.code = shape.code;
    this.details = shape.details;
    this.name = 'AppError';
  }

  toJSON(): AppErrorShape {
    return { code: this.code, message: this.message, details: this.details };
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super({ code: 'VALIDATION_ERROR', message, details });
    this.name = 'ValidationError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, details?: unknown) {
    super({ code: 'EXTERNAL_SERVICE_ERROR', message: `External service failed: ${service}`, details });
    this.name = 'ExternalServiceError';
  }
}
