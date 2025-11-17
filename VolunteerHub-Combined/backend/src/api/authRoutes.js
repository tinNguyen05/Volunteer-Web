const express = require('express');
const { body } = require('express-validator');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const validationMiddleware = require('../middlewares/validation');
const authController = require('../controllers/authController');

const router = express.Router();

// Register validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number'),
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, validationMiddleware, authController.register);
router.post('/login', loginValidation, validationMiddleware, authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/deactivate', authMiddleware, authController.deactivateUser);

// Admin routes
router.get('/users', authMiddleware, roleMiddleware(['admin']), authController.getAllUsers);
router.get('/user/:id', authMiddleware, authController.getUserById);

module.exports = router;
