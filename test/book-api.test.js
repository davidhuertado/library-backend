const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const app = require('../app');
const Book = require('../models/book');
const User = require('../models/user');

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

const testUser = {
  username: 'admin',
  password: 'pass123',
};

let token;

const api = supertest(app);

describe('testing book api', () => {
  beforeEach(async () => {
    //  Clean and add a user
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash(testUser.password, 10);

    const userEncrypted = new User({
      username: 'admin',
      passwordHash,
    });
    await userEncrypted.save();

    const response = await api.post('/api/login').send(testUser).expect(200);

    // Set token for auth
    token = response.body.token;

    // Clean and set books
    await Book.deleteMany({});
    const booksObjects = initialBooks.map(
      (book) => new Book({ ...book, user: response.id })
    );
    const promiseArray = booksObjects.map((object) => object.save());
    await Promise.all(promiseArray);
  });

  test('books are returned as json', async () => {
    await api
      .get('/api/books')
      .set({ Authorization: `bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all books are returned', async () => {
    const response = await api
      .get('/api/books')
      .set({ Authorization: `bearer ${token}` });

    expect(response.body).toHaveLength(initialBooks.length);
  });

  test(' a specific book its in the response', async () => {
    const response = await api
      .get('/api/books')
      .set({ Authorization: `bearer ${token}` });

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

    const response = await api
      .get('/api/books')
      .set({ Authorization: `bearer ${token}` });

    expect(response.body).toHaveLength(initialBooks.length + 1);

    const booksTitles = response.body.map((element) => element.title);
    expect(booksTitles).toContain('testing post');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
