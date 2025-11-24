import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Joi = require('joi');
const { validateRequest } = require('../src/middlewares/validation');
const { logger } = require('../src/utils/logger');

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('validateRequest middleware', () => {
  it('passes through when no schemas are provided', () => {
    const next = vi.fn();

    validateRequest()({ params: {}, query: {}, body: {} }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('forwards a formatted validation error when payload is invalid', () => {
    const warnSpy = vi.spyOn(logger, 'warn');
    const schema = { body: Joi.object({ age: Joi.number().min(18).required() }) };
    const next = vi.fn();

    validateRequest(schema)({ params: {}, query: {}, body: { age: 16 } }, {}, next);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        type: 'validation',
        details: [
          expect.objectContaining({
            message: expect.stringContaining('"age" must be greater than or equal to 18'),
            path: ['age'],
          }),
        ],
      }),
    );
  });
});
