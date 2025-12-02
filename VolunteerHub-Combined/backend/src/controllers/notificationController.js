const Notification = require('../models/Notification');
const { subscribePush, unsubscribePush } = require('../services/notificationService');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// Get User Notifications
const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { unreadOnly } = req.query;

    const query = { recipient: req.user._id };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar')
      .populate('relatedEvent', 'title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    successResponse(res, 'Notifications retrieved successfully', {
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve notifications: ' + error.message);
  }
};

// Mark Notification as Read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return errorResponse(res, 404, 'Notification not found');
    }

    successResponse(res, 'Notification marked as read', { notification });
  } catch (error) {
    errorResponse(res, 500, 'Failed to mark notification as read: ' + error.message);
  }
};

// Mark All Notifications as Read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    successResponse(res, 'All notifications marked as read');
  } catch (error) {
    errorResponse(res, 500, 'Failed to mark all notifications as read: ' + error.message);
  }
};

// Subscribe to Push Notifications
const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return errorResponse(res, 400, 'Invalid subscription data');
    }

    await subscribePush(req.user._id, subscription);

    successResponse(res, 'Successfully subscribed to push notifications');
  } catch (error) {
    errorResponse(res, 500, 'Failed to subscribe: ' + error.message);
  }
};

// Unsubscribe from Push Notifications
const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return errorResponse(res, 400, 'Endpoint is required');
    }

    await unsubscribePush(req.user._id, endpoint);

    successResponse(res, 'Successfully unsubscribed from push notifications');
  } catch (error) {
    errorResponse(res, 500, 'Failed to unsubscribe: ' + error.message);
  }
};

// Get VAPID Public Key
const getVapidPublicKey = async (req, res) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;

    if (!publicKey) {
      return errorResponse(res, 500, 'VAPID public key not configured');
    }

    successResponse(res, 'VAPID public key retrieved', { publicKey });
  } catch (error) {
    errorResponse(res, 500, 'Failed to get VAPID key: ' + error.message);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  subscribe,
  unsubscribe,
  getVapidPublicKey,
};
