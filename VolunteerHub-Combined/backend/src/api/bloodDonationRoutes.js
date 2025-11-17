const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const validationMiddleware = require('../middlewares/validation');
const bloodDonationController = require('../controllers/bloodDonationController');

const router = express.Router();

// Blood donation registration validation
const donationValidation = [
  body('donorName').trim().notEmpty().withMessage('Donor name is required'),
  body('donorEmail').isEmail().withMessage('Invalid email'),
  body('donorPhone').notEmpty().withMessage('Phone number is required'),
  body('bloodType').isIn(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).withMessage('Invalid blood type'),
  body('preferredEventDate').notEmpty().withMessage('Preferred event date is required'),
];

// Public routes
router.post('/register', donationValidation, validationMiddleware, bloodDonationController.registerDonation);
router.get('/statistics', bloodDonationController.getBloodStatistics);

// Admin/Manager routes
router.get('/all', authMiddleware, roleMiddleware(['manager', 'admin']), bloodDonationController.getAllDonations);
router.put('/:donationId/status', authMiddleware, roleMiddleware(['manager', 'admin']), bloodDonationController.updateDonationStatus);

module.exports = router;
