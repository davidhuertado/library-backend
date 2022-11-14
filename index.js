require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

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

const requestLogger = (req, res, next) => {
  console.log('Method', req.method);
  console.log('Path', req.path);
  console.log('Body', req.body);
  next();
};

app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use(usersRouter);
app.use('/api/books', booksRouter);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
