require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const usersRouter = require('./controllers/users');
const booksRouter = require('./controllers/books');

const app = express();

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    logger.info('Connected to database');
  })
  .catch((error) => {
    logger.error(error);
  });

app.use(express.json());
app.use(morgan('tiny'));

app.use(usersRouter);
app.use('/api/books', booksRouter);

app.use(middleware.errorHandler);

module.exports = app;
