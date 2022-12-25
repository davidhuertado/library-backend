require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const usersRouter = require('./controllers/users');
const booksRouter = require('./controllers/books');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');

const app = express();

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info('Connected to database');
  })
  .catch((error) => {
    logger.error(error);
  });

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(middleware.tokenExtractor);

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/books', middleware.userExtractor, booksRouter);

app.use(middleware.errorHandler);

module.exports = app;
