const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//Forgot Password Endpoint
router.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {;  
        return res.status(500).json({ message: error.message });
    }
});
    // Generate a random token
        const token = crypto.randomBytes(32).toString('hex');
        us


