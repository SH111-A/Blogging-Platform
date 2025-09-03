const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, tags } = req.body;
      const post = new Post({
        title,
        content,
        tags,
        author: req.user.userId,
      });

      await post.save();

      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

module.exports = router;
