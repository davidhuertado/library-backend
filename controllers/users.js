const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('books');
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ error: 'must inlclude username and password' });

    if (username.length < 4 || password.length < 4)
      return res
        .status(400)
        .json({ error: 'username and password needs 4 characters at least' });

    const usernameItsRepeated = await User.findOne({ username });

    if (usernameItsRepeated)
      return res.status(400).json({ error: `username it's not available` });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      passwordHash,
    });

    const savedUser = await user.save();

    return res.status(201).json(savedUser);
  } catch (err) {
    return next(err);
  }
});

module.exports = usersRouter;
