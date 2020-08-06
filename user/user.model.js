const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarURL: { type: String },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: { type: String },
  verificationToken: { type: String },
});

const model = mongoose.model('User', schema);

module.exports = model;