/* eslint-disable no-underscore-dangle */
const booksRouter = require('express').Router();
const Book = require('../models/book');
const User = require('../models/user');

booksRouter.get('/', async (req, res, next) => {
  try {
    const books = await Book.find({}).populate('user');
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
  try {
    const { body } = req;

    if (!body.title || !body.userId) {
      return res.status(400).json({
        error: 'content missing',
      });
    }

    const user = await User.findById(body.userId);

    const book = new Book({
      title: body.title,
      author: body.author || '',
      year: body.year || '',
      read: body.read || false,
      user: user._id,
    });

    const savedBook = await book.save();

    user.books = [...user.books, savedBook._id];

    await user.save();

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
