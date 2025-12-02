const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'event_created',
        'event_approved',
        'event_rejected',
        'registration_new',
        'registration_approved',
        'registration_rejected',
        'post_new',
        'comment_new',
        'like_new',
        'event_completed',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    relatedRegistration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
