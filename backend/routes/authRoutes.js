const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Email/password registration with validation
router.post(
  '/register',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

// Email/password login with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
  }
);

// Google OAuth login initiation
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Redirect frontend with token (adjust URL as per your frontend)
    res.redirect(`${process.env.FRONTEND_URL}/social-login?token=${token}`);
  }
);

module.exports = router;
