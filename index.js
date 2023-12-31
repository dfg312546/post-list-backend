require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const postsRoutes = require('./api/routes/post-routes');
const usersRoutes = require('./api/routes/users-routes');
const HttpError = require('./api/models/http-error');

const app = express();
app.use(cors());

app.use(bodyParser.json());



app.use('/api/posts',postsRoutes);
app.use('/api/users',usersRoutes);

app.use((req,res,next) => {
  const error = new HttpError('Could not find this route.',404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gbhqqxc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
.catch((error) => {
  console.log(error);
})

module.exports = app;