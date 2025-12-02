const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/auth');
const validationMiddleware = require('../middlewares/validation');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Subscription validation
const subscriptionValidation = [
  body('subscription').notEmpty().withMessage('Subscription data is required'),
  body('subscription.endpoint').notEmpty().withMessage('Endpoint is required'),
  body('subscription.keys').notEmpty().withMessage('Keys are required'),
];

// Routes
router.get('/', authMiddleware, notificationController.getNotifications);
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);
router.put('/read-all', authMiddleware, notificationController.markAllAsRead);
router.post('/subscribe', authMiddleware, subscriptionValidation, validationMiddleware, notificationController.subscribe);
router.post('/unsubscribe', authMiddleware, notificationController.unsubscribe);
router.get('/vapid-public-key', notificationController.getVapidPublicKey);

module.exports = router;
