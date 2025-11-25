import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  ValidationError,
  buildBackendValidationError,
  normalizeBackendValidationError,
  validateData,
} from './validation';

describe('validateData', () => {
  it('returns parsed data on success', () => {
    const schema = z.object({ name: z.string() });
    const result = validateData(schema, { name: 'Ada' });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: 'Ada' });
  });

  it('returns structured error on failure', () => {
    const schema = z.object({ name: z.string().min(2) });
    const result = validateData(schema, { name: 'A' });

    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(ValidationError);
    expect(result.error.details.fieldErrors.name[0]).toContain(
      'expected string to have >=2 characters'
    );
  });
});

describe('backend validation helpers', () => {
  it('normalizes a backend validation payload', () => {
    const normalized = normalizeBackendValidationError({
      message: 'Invalid payload',
      errors: { email: ['Invalid email'], age: 'Too young' },
      formErrors: ['General issue'],
    });

    expect(normalized).toEqual({
      message: 'Invalid payload',
      fieldErrors: { email: ['Invalid email'], age: ['Too young'] },
      formErrors: ['General issue'],
      raw: {
        message: 'Invalid payload',
        errors: { email: ['Invalid email'], age: 'Too young' },
        formErrors: ['General issue'],
      },
    });
  });

  it('builds a ValidationError with normalized details', () => {
    const error = buildBackendValidationError({ errors: { username: ['Taken'] } });

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.details.fieldErrors.username).toEqual(['Taken']);
    expect(error.message).toBe('Request validation failed');
  });
});
