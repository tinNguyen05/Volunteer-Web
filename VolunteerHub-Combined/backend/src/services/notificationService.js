const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');
const webpush = require('web-push');

// Initialize web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@volunteerhub.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Create Notification
const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  relatedEvent,
  relatedPost,
  relatedRegistration,
}) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      title,
      message,
      relatedEvent,
      relatedPost,
      relatedRegistration,
    });

    await notification.save();

    // Send push notification
    await sendPushNotification(recipient, { title, message, type });

    return notification;
  } catch (error) {
    console.error('Create Notification Error:', error);
    throw error;
  }
};

// Send Push Notification
const sendPushNotification = async (userId, payload) => {
  try {
    // Find active subscriptions for user
    const subscriptions = await PushSubscription.find({
      user: userId,
      isActive: true,
    });

    if (subscriptions.length === 0) {
      console.log('No active push subscriptions for user:', userId);
      return;
    }

    const notificationPayload = JSON.stringify(payload);

    // Send to all subscriptions
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          notificationPayload
        );
      } catch (error) {
        console.error('Push notification failed:', error);
        
        // If subscription is invalid, mark as inactive
        if (error.statusCode === 410 || error.statusCode === 404) {
          sub.isActive = false;
          await sub.save();
        }
      }
    });

    await Promise.all(sendPromises);
  } catch (error) {
    console.error('Send Push Notification Error:', error);
  }
};

// Subscribe to Push Notifications
const subscribePush = async (userId, subscription) => {
  try {
    // Check if subscription already exists
    const existing = await PushSubscription.findOne({
      endpoint: subscription.endpoint,
    });

    if (existing) {
      existing.user = userId;
      existing.keys = subscription.keys;
      existing.isActive = true;
      await existing.save();
      return existing;
    }

    const newSubscription = new PushSubscription({
      user: userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    });

    await newSubscription.save();
    return newSubscription;
  } catch (error) {
    console.error('Subscribe Push Error:', error);
    throw error;
  }
};

// Unsubscribe from Push Notifications
const unsubscribePush = async (userId, endpoint) => {
  try {
    await PushSubscription.findOneAndUpdate(
      { user: userId, endpoint },
      { isActive: false }
    );
  } catch (error) {
    console.error('Unsubscribe Push Error:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  sendPushNotification,
  subscribePush,
  unsubscribePush,
};
