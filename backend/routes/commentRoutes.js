const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const router = express.Router();

router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: 'Post not found' }] });
    }
    const comment = new Comment({
      content,
      author: req.user.userId,
      post: req.params.postId,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

module.exports = router;
