const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const validationMiddleware = require('../middlewares/validation');
const eventController = require('../controllers/eventController');

const router = express.Router();

// Event creation validation
const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['Education', 'Health', 'Environment', 'Social', 'Relief']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
];

// Public routes
router.get('/all', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.post('/create', authMiddleware, roleMiddleware(['manager', 'admin']), eventValidation, validationMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventValidation, validationMiddleware, eventController.updateEvent);
router.post('/register', authMiddleware, eventController.registerForEvent);
router.get('/user/registered', authMiddleware, eventController.getUserRegisteredEvents);
router.get('/user/history', authMiddleware, eventController.getParticipationHistory);

// Admin/Manager routes
router.post('/:eventId/approve', authMiddleware, roleMiddleware(['manager', 'admin']), eventController.approveEvent);
router.put('/registration/:registrationId/status', authMiddleware, roleMiddleware(['manager', 'admin']), eventController.updateRegistrationStatus);
router.post('/:eventId/complete', authMiddleware, roleMiddleware(['manager', 'admin']), eventController.completeEvent);

module.exports = router;
