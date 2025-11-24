import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalEnv = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  Object.assign(process.env, originalEnv);
});

afterEach(() => {
  Object.assign(process.env, originalEnv);
});

describe('database configuration', () => {
  it('throws when DATABASE_URL is not configured', async () => {
    delete process.env.DATABASE_URL;
    const { getDatabaseUrl } = await import('../src/config/database');

    expect(() => getDatabaseUrl()).toThrow(/DATABASE_URL is not set/);
  });

  it('creates and reuses the same pool instance', async () => {
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';
    const { getPool } = await import('../src/config/database');

    const pool = getPool();
    const reused = getPool();

    expect(reused).toBe(pool);
    expect(pool.options.connectionString).toBe(process.env.DATABASE_URL);
    expect(pool.options.ssl.rejectUnauthorized).toBe(false);

    await pool.end();
  });
});
