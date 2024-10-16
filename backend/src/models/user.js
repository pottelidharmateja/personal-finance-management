const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginHistory: [{ type: Date }] // Array to store login timestamps
});

module.exports = mongoose.model('User', UserSchema);
