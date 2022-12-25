const jwt = require('jsonwebtoken');
const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'malformatted id',
    });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message,
    });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  return next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = (req, res, next) => {
  if (
    req.method === 'POST' ||
    req.method === 'DELETE' ||
    req.method === 'GET'
  ) {
    const { token } = req;

    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.user = {
      username: decodedToken.username,
      id: decodedToken.id,
    };
  }
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
