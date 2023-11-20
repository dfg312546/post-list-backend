const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Post = require('../models/post');
const User = require('../models/user')

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title,description,date,creator,name } = req.body;

  const createdPost = new Post({
    title,
    description,
    date,
    creator,
    name
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating post failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);


  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating post failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({post: createdPost});
};

const getPosts = async (req, res ,next) => {
  let posts;
  try {
    posts = await Post.find()
  } catch (err) {
    const error = new HttpError(
      'Fetching posts failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ posts: posts.map(post => post.toObject({ getters: true })) });
}

const getPostById = async (req, res, next) => {
  const postId = req.params.postId;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong,could not find post.',500
    );
    return next(error)
  }

  if (!post) {
    const error = new HttpError('Could not find a post for the provided id.', 404);
    return next(error)
  }

  res.json({ post: post.toObject({getters: true}) });
};

const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description,date } = req.body;
  const postId = req.params.postId;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong,could not find post.',500
    );
    return next(error)
  }

  if (post.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this place.',
      401
    );
    return next(error);
  }

  post.title = title;
  post.description = description;
  post.date = date

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update post.',
      500
    );
    return next(error);
  }

  res.status(200).json({ post: post.toObject({ getters: true }) });
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong,could not find post.',500
    );
    return next(error)
  }

  if (!post) {
    const error = new HttpError('Could not find a post for the provided id.', 404);
    return next(error)
  }

  try {
    await post.deleteOne()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete post.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted post.' });
}

exports.createPost = createPost
exports.getPostById = getPostById
exports.getPosts = getPosts
exports.updatePost = updatePost
exports.deletePost = deletePost