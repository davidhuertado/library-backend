require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const config = require('./utils/config');

const usersRouter = require('./controllers/users');
const booksRouter = require('./controllers/books');

const app = express();

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error(error);
  });

app.use(express.json());
app.use(morgan('tiny'));

app.use(usersRouter);
app.use('/api/books', booksRouter);

//
module.exports = app;
