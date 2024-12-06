import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // User's email
  password: { type: String, required: true }, // User's hashed password
  firstName: { type: String, required: true }, // Added firstName field
});

const User = mongoose.model('User', userSchema);

export default User; // Use default export for ES module
