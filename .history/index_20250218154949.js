// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Import and use the routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
app.use(authRoutes);
app.use(userRoutes);

//app.use(express.static(path.join(__dirname, 'client', 'build')));

//app.get('*', (req, res) => {
   // res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
