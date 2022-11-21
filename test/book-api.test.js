const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Book = require('../models/book');

const initialBooks = [
  {
    title: 'Odisea',
    author: 'Homero',
    year: '1993',
    read: false,
  },
  {
    title: 'Iliada',
    read: true,
  },
];

beforeEach(async () => {
  await Book.deleteMany({});
  const booksObjects = initialBooks.map((book) => new Book(book));
  const promiseArray = booksObjects.map((object) => object.save());
  await Promise.all(promiseArray);
});

const api = supertest(app);

test('books are returned as json', async () => {
  await api
    .get('/api/books')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all books are returned', async () => {
  const response = await api.get('/api/books');

  expect(response.body).toHaveLength(initialBooks.length);
});

test(' a specific book its in the response', async () => {
  const response = await api.get('/api/books');

  const mappedTitles = response.body.map((book) => book.title);

  expect(mappedTitles).toContain('Iliada');
});

test('post a book', async () => {
  const book = {
    title: 'testing post',
    author: 'admin',
    read: true,
  };

  const bookObject = new Book(book);
  await bookObject.save();

  const response = await api.get('/api/books');

  expect(response.body).toHaveLength(initialBooks.length + 1);

  const booksTitles = response.body.map((element) => element.title);
  expect(booksTitles).toContain('testing post');
});

afterAll(async () => {
  await mongoose.connection.close();
});
