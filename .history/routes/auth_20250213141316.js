const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Forgot Password Endpoint
router.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Generate a secure token and set expiry (1 hour)
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  // Configure Nodemailer transporter (ensure valid SMTP settings)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetURL = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: 'no-reply@yourapp.com',
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click on the following link to reset your password: ${resetURL}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ message: 'Error sending email.' });
    res.json({ message: 'Reset link sent to your email.' });
  });
});

// Verify Token Endpoint
router.get('/api/verify-token', async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ valid: false, message: 'Token is invalid or has expired.' });
  }
  res.json({ valid: true });
});

// Reset Password Endpoint
router.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired.' });
  }
  
  const saltRounds = 10;
  user.password = await bcrypt.hash(password, saltRounds);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;
// In this code snippet I  defined three endpoints for the password reset feature: /api/forgot-password, /api/verify-token, and /api/reset-password.