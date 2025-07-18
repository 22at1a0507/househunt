const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['renter', 'owner', 'admin'], required: true }
});

module.exports = mongoose.model('User', UserSchema);
