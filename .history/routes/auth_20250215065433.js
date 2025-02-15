const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Settings = require('../models/settings');

const router = express.Router();

// POST: Forgot Password - Send Reset Link
router.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Generate a secure token and set expiry (1 hour)
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  // Fetch SMTP settings from MongoDB
  const smtpSettings = await Settings.findOne({});
console.log('SMTP Settings fetched:', smtpSettings);
if (!smtpSettings) {
  return res.status(500).json({ message: 'SMTP settings not configured in DB.' });
}

  const smtpSettings = await Settings.findOne({});
  if (!smtpSettings) {
    return res.status(500).json({ message: 'SMTP settings not configured in DB.' });
  }

  const transporter = nodemailer.createTransport({
    host: smtpSettings.smtpHost,
    port: smtpSettings.smtpPort,
    auth: {
      user: smtpSettings.emailUser,
      pass: smtpSettings.emailPass,
    },
  });

  const resetURL = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: 'no-reply@dummyapp.com',
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ message: 'Error sending email.' });
    console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    res.json({ message: 'Reset link sent to your email (dummy email).' });
  });
});

// GET: Verify Token
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

// POST: Reset Password
router.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Token is invalid or has expired.' });

  // Hash new password and update user record
  const saltRounds = 10;
  user.password = await bcrypt.hash(password, saltRounds);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;
