export type AppErrorShape = {
  code: string;
  message: string;
  details?: unknown;
};

export class AppError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor({ code, message, details }: AppErrorShape) {
    super(message);
    this.code = code;
    this.details = details;
  }

  toJSON(): AppErrorShape {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: unknown) {
    super({
      code: 'VALIDATION_ERROR',
      message: `Validation failed: ${message}`,
      details,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, details?: unknown) {
    super({
      code: 'EXTERNAL_SERVICE_ERROR',
      message: `External service failed: ${service}`,
      details,
    });
  }
}
