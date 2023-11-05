const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/post-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {//避免CORS錯誤
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods','Get, POST, PATCH, DELETE');

  next();
})

app.use('/api/posts',postsRoutes);
// app.use('/api/users',usersRoutes);

app.use((req,res,next) => {
  const error = new HttpError('Could not find this route.',404);
  throw error
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
.connect('mongodb+srv://connectToBack:connectToBack@cluster0.gbhqqxc.mongodb.net/easyMERN?retryWrites=true&w=majority')
.then(() => {
  app.listen(5000);
})
.catch((error) => {
  console.log(error);
})