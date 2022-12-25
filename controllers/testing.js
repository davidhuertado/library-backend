const testingRouter = require('express').Router();
const Book = require('../models/book');
const User = require('../models/user');

testingRouter.post('/reset', async (req, res) => {
  await Book.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
