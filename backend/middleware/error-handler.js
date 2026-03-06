const errorHandler = (error, _req, res, _next) => {
  console.error('Unexpected Expult Global backend error.', error);

  res.status(500).json({
    status: 'error',
    message: 'An unexpected server error occurred. Please try again shortly.'
  });
};

module.exports = errorHandler;