const booksRouter = require('express').Router();
const Book = require('../models/book');

booksRouter.get('/', async (req, res, next) => {
  try {
    const books = await Book.find({});
    return res.status(200).json(books);
  } catch (error) {
    return next(error);
  }
});

booksRouter.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).end();
  } catch (error) {
    return next(error);
  }
});

booksRouter.post('/', async (req, res, next) => {
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

  try {
    const savedBook = await book.save();

    return res.status(401).json(savedBook);
  } catch (error) {
    return next(error);
  }
});

booksRouter.delete('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) return res.status(404).end();
    return res.status(204);
  } catch (error) {
    return next(error);
  }
});

module.exports = booksRouter;
