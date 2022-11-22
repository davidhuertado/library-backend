const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('when there is one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('pass123', 10);

    const user = new User({
      username: 'admin',
      passwordHash,
    });
    await user.save();
  });

  test('create a user', async () => {
    const { body: usersBefore } = await api.get('/api/users');

    const userToPost = {
      username: 'testUser',
      password: 'pass123',
    };

    await api
      .post('/api/users')
      .send(userToPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const { body: usersAfter } = await api.get('/api/users');

    expect(usersAfter).toHaveLength(usersBefore.length + 1);

    const mappedUsers = usersAfter.map((u) => u.username);
    expect(mappedUsers).toContain(userToPost.username);
  });

  test('do not allow to create an user with a repeated username', async () => {
    const user = {
      username: 'admin',
      password: 'clave',
    };
    const { body: usersBeforeRequest } = await api.get('/api/users');

    const response = await api.post('/api/users').send(user).expect(400);

    const { body: usersAfterRequest } = await api.get('/api/users');

    expect(response.body.error).toContain(`username it's not available`);
    expect(usersBeforeRequest).toHaveLength(usersAfterRequest.length);
  });

  test('fails without username', async () => {
    const user = {
      password: 'clave',
    };
    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toContain(
      `must inlclude username and password`
    );
  });
  test('fails with username shorter than 4 characters', async () => {
    const user = {
      username: '123',
      password: 'clave',
    };
    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toContain(
      `username and password needs 4 characters at least`
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
