const express = require('express');
const { body } = require('express-validator');
const { authMiddleware } = require('../middlewares/auth');
const validationMiddleware = require('../middlewares/validation');
const postController = require('../controllers/postController');

const router = express.Router();

// Post validation
const postValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('body').trim().notEmpty().withMessage('Body is required'),
  body('eventId').notEmpty().withMessage('Event ID is required'),
];

// Comment validation
const commentValidation = [
  body('postId').notEmpty().withMessage('Post ID is required'),
  body('text').trim().notEmpty().withMessage('Comment text is required'),
];

// Routes
router.post('/create', authMiddleware, postValidation, validationMiddleware, postController.createPost);
router.get('/event/:eventId', postController.getPostsByEvent);
router.post('/:postId/like', authMiddleware, postController.toggleLike);
router.post('/comment', authMiddleware, commentValidation, validationMiddleware, postController.addComment);
router.get('/:postId/comments', postController.getCommentsByPost);
router.delete('/:postId', authMiddleware, postController.deletePost);

module.exports = router;
