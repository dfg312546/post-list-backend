const express = require('express');
const { check } = require('express-validator');

const router = express.Router();
const postControllers = require('../controllers/posts-controllers')

router.get('/',postControllers.getPosts);

router.get('/:postId',postControllers.getPostById);

router.post('/',
  [
    check('title')
    .isLength({ max: 20 })
    .not()
    .isEmpty(),
    check('description')
    .not()
    .isEmpty(),
  ],
  postControllers.createPost
);

router.patch('/:postId',
  [
    check('title')
    .not()
    .isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  postControllers.updatePost
);

router.delete('/:postId',postControllers.deletePost);

module.exports = router