const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,    // Name should be required since you want to store it
  },
  email: {
    type: String,
    required: true,    // Email should also be required
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    portfolio: { type: String, default: '' },
  },
  image:{
  type: String,
  default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);