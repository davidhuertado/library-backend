/* eslint-disable no-underscore-dangle */
const booksRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
// const User = require('../models/user');

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

// const getTokenFrom = (req) => {
//   const authorization = req.get('authorization');
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7);
//   }
//   return null;
// };

booksRouter.post('/', async (req, res, next) => {
  try {
    const { body } = req;
    const { user } = req;

    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(403).json({ error: 'invalid token' });
    }

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
      user: user.id,
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
    const { user } = req;
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).end();
    if (user.id.toString() !== book.user.toString()) {
      return res.status(403).json({
        error: 'This user cannot delete this book',
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    return res.status(204);
  } catch (error) {
    return next(error);
  }
});

module.exports = booksRouter;
