const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginHistory: [{ type: Date }], // Optional field for storing login timestamps
});

module.exports = mongoose.model('User', userSchema);
