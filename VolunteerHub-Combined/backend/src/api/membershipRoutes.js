const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const validationMiddleware = require('../middlewares/validation');
const membershipController = require('../controllers/membershipController');

const router = express.Router();

// Membership validation
const membershipValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('acceptTerms').isBoolean().withMessage('Must accept terms and conditions'),
];

// Public routes
router.post('/register', membershipValidation, validationMiddleware, membershipController.createMembership);
router.get('/statistics', membershipController.getMembershipStats);

// Admin routes
router.get('/all', authMiddleware, roleMiddleware(['admin']), membershipController.getAllMemberships);
router.put('/:membershipId/approve', authMiddleware, roleMiddleware(['admin']), membershipController.approveMembership);
router.put('/:membershipId/reject', authMiddleware, roleMiddleware(['admin']), membershipController.rejectMembership);

module.exports = router;
