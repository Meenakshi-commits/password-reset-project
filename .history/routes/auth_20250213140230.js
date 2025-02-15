const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });