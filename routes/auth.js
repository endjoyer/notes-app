const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  try {
    console.log('res', res);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.log('err', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token, userId: user.id });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
