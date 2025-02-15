const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  smtpHost: { type: String, required: true },
  smtpPort: { type: Number, required: true },
  emailUser: { type: String, required: true },
  emailPass: { type: String, required: true },
});

module.exports = mongoose.model('settings', settingsSchema);
