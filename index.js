// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// const config = require('./utils/config');

// const usersRouter = require('./controllers/users');
// const booksRouter = require('./controllers/books');

// const app = express();

// mongoose
//   .connect(config.MONGO_URI)
//   .then(() => {
//     console.log('Connected to database');
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

// app.use(usersRouter);
// app.use('/api/books', booksRouter);

// const { PORT } = process.env;
// app.listen(PORT, () => {
//   console.log(`Server started on ${PORT}`);
// });

const http = require('http');
const app = require('./app');
const config = require('./utils/config');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server connected in Port ${config.PORT}`);
});
