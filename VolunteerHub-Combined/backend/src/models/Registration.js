const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'registered',
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: 0,
    },
    feedback: {
      type: String,
      maxlength: [500, 'Feedback cannot be more than 500 characters'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
    completionDate: Date,
  },
  { timestamps: true }
);

// Ensure unique registration per volunteer per event
registrationSchema.index({ volunteer: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
