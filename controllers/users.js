const usersRouter = require('express').Router();

usersRouter.get('/api/users', (req, res) => {
  res.json({
    message: 'hola',
  });
});

// usersRouter.post('/', (req, res) => {
//   const body = { req };
// });

module.exports = usersRouter;
