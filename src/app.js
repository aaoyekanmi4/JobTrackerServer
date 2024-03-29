require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const jobsRouter = require('./jobs/jobs-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/usersRouter');
const contactsRouter = require('./contacts/contacts-router');

const app = express();
app.use(cors());

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';
// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'DELETE, PATCH, GET, POST');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });
app.use(morgan(morganOption));
app.use(helmet());


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use(jobsRouter);
app.use(contactsRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: error.message, error} };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
