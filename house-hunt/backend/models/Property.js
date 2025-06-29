const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  propType: String,
  adType: String,
  isAvailable: { type: Boolean, default: true },
  address: String,
  contact: String,
  amount: Number,
  images: [String],
  additionalInfo: String, 
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
