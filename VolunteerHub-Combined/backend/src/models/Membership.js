const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: String,
    state: String,
    zipCode: String,
    membershipType: {
      type: String,
      enum: ['basic', 'premium', 'vip'],
      default: 'basic',
    },
    interests: [String],
    bio: String,
    acceptTerms: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive'],
      default: 'pending',
    },
    verificationStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
