const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(500).json({
    error: { message: 'Erro interno do servidor.' },
  });
};

module.exports = { errorHandler };
