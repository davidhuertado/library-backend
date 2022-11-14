require('dotenv').config();

const { PORT } = process.env;

const { MONGO_URI } = process.env;

module.exports = {
  PORT,
  MONGO_URI,
};
