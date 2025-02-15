const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

//Forgot Password Endpoint
router.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
// Generate a random token
const token = crypto.randomBytes(32).toString("hex");
user.resetPasswordToken = token;
user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
await user.save();

//configure Node Mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    },
});

const resetURL = `http://localhost:3000/reset-password/?token${token}`;