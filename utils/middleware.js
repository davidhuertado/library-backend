const logger = require('./logger');

const errorHandler = (error, req, res, next) => {
  console.log('middleware');
  logger.error(error);
  next(error);
};

module.exports = { errorHandler };
