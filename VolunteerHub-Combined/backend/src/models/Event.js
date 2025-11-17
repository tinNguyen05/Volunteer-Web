const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      enum: ['Education', 'Health', 'Environment', 'Social', 'Relief'],
      required: [true, 'Please select a category'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please provide start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please provide end time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide event location'],
    },
    image: {
      type: String,
      default: null,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    requiredVolunteers: {
      type: Number,
      default: 0,
    },
    registeredVolunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    impact: {
      type: String,
      maxlength: [500, 'Impact description cannot be more than 500 characters'],
    },
    skills: [String],
    requirements: [String],
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvalDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
