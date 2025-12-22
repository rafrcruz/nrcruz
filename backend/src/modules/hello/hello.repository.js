const { getPool } = require('../../config/database');

const fetchHelloMessage = async () => {
  const pool = getPool();
  const result = await pool.query(
    'SELECT message FROM hello_messages ORDER BY created_at DESC LIMIT 1',
  );

  if (result.rows.length > 0) {
    return result.rows[0].message;
  }

  return 'Nenhuma mensagem encontrada.';
};

module.exports = { fetchHelloMessage };
