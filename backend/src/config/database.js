const { Pool } = require('pg');

// Use a single env var to keep config consistent across app and migrations.
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. Define your Postgres connection string.');
  }

  return url;
};

let pool;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: {
        // Neon requires TLS; disable CA validation by default so it works locally/out of the box.
        rejectUnauthorized: false,
      },
    });

    pool.on('error', error => {
      // Log once and let the process crash if an unrecoverable error bubbles.
      console.error('Unexpected error on idle Postgres client', error);
    });
  }

  return pool;
};

module.exports = { getDatabaseUrl, getPool };
