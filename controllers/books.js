/* eslint-disable no-underscore-dangle */
const booksRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const User = require('../models/user');

booksRouter.get('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'invalid token' });
    }
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
    const { user } = req;

    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'invalid token' });
    }

    if (!body.title) {
      return res.status(400).json({
        error: 'content missing',
      });
    }
    const userInDb = await User.findById(decodedToken.id);

    const book = new Book({
      title: body.title,
      author: body.author || 'N/S',
      year: body.year || 'N/S',
      read: body.read || false,
      user: user.id,
    });

    const savedBook = await book.save();

    userInDb.books = [...userInDb.books, savedBook._id];

    await userInDb.save();

    return res.status(201).json(savedBook);
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

    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

booksRouter.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    if (typeof read !== 'boolean') return res.status(400).end();

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { read },
      { new: true }
    );

    return res.json(updatedBook);
  } catch (err) {
    return next(err);
  }
});

module.exports = booksRouter;
