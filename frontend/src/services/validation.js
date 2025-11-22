import { z } from 'zod';

/**
 * Minimal validation helper built on top of Zod.
 *
 * Example usage:
 * const schema = z.object({ name: z.string().min(1) });
 * const result = validateData(schema, { name: 'Alice' });
 * if (!result.success) {
 *   // result.error.details.fieldErrors contains the structured errors
 *   // Components or future form layers can inspect result.error instanceof ValidationError
 * }
 *
 * Backend validation errors (HTTP 400) thrown by apiClient are also wrapped
 * into ValidationError, so components can reuse the same shape regardless of
 * whether the validation ran locally or came from the server.
 */
export class ValidationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = {
      fieldErrors: details.fieldErrors ?? {},
      formErrors: details.formErrors ?? [],
      raw: details.raw ?? null,
    };
  }
}

export const validateData = (schema, data) => {
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    return { success: true, data: parsed.data };
  }

  const flattened = parsed.error.flatten();
  return {
    success: false,
    error: new ValidationError('Invalid input data', {
      fieldErrors: flattened.fieldErrors ?? {},
      formErrors: flattened.formErrors ?? [],
      raw: parsed.error,
    }),
  };
};

const normalizeValidationEntries = errors => {
  if (typeof errors !== 'object' || errors === null) {
    return {};
  }

  return Object.entries(errors).reduce((normalized, [field, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      normalized[field] = [String(value)];
      return normalized;
    }

    if (Array.isArray(value)) {
      const messages = value
        .map(item => (typeof item === 'string' || typeof item === 'number' ? String(item) : null))
        .filter(Boolean);

      if (messages.length > 0) {
        normalized[field] = messages;
      }
    }

    return normalized;
  }, {});
};

// Safely extract a predictable shape from backend validation payloads (HTTP 400),
// ensuring components receive { message, fieldErrors, formErrors, raw } even when
// the API response varies.
export const normalizeBackendValidationError = payload => {
  const defaultMessage = 'Request validation failed';
  const baseDetails = {
    message: defaultMessage,
    fieldErrors: {},
    formErrors: [],
    raw: payload ?? null,
  };

  if (typeof payload !== 'object' || payload === null) {
    return baseDetails;
  }

  const message = typeof payload.message === 'string' ? payload.message : defaultMessage;
  const fieldErrors = normalizeValidationEntries(payload.errors);
  const formErrors = Array.isArray(payload.formErrors)
    ? payload.formErrors
        .map(item => (typeof item === 'string' || typeof item === 'number' ? String(item) : null))
        .filter(Boolean)
    : [];

  return {
    ...baseDetails,
    message,
    fieldErrors,
    formErrors,
  };
};

export const buildBackendValidationError = payload => {
  const details = normalizeBackendValidationError(payload);
  return new ValidationError(details.message, details);
};
