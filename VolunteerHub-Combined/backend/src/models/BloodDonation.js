const mongoose = require('mongoose');

const bloodDonationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    donorEmail: {
      type: String,
      required: [true, 'Donor email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    donorPhone: {
      type: String,
      required: [true, 'Donor phone is required'],
    },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'Blood type is required'],
    },
    lastDonationDate: Date,
    preferredEventDate: {
      type: String,
      required: [true, 'Preferred event date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BloodDonation', bloodDonationSchema);
