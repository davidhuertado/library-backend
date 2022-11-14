const booksRouter = require('express').Router();
const Book = require('../models/book');

booksRouter.post('/', async (req, res) => {
  console.log('enter');
  const { body } = req;

  if (!body.title) {
    return res.status(400).json({
      error: 'content missing',
    });
  }

  const book = new Book({
    title: body.title,
    author: body.author || '',
    year: body.year || '',
    read: body.read || false,
  });

  const savedBook = await book.save();

  return res.status(401).json(savedBook);
});

module.exports = booksRouter;
