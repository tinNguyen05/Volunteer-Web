const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Routes
router.get('/stats', authMiddleware, dashboardController.getDashboardStats);
router.get('/trending-events', dashboardController.getTrendingEvents);
router.get('/recent-posts', dashboardController.getRecentPosts);
router.get('/export', authMiddleware, roleMiddleware(['admin']), dashboardController.exportData);

module.exports = router;
