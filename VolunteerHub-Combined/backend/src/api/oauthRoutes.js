// ==================== OAUTH ROUTES ====================
const express = require('express');
const passport = require('passport');
const oauthController = require('../controllers/oauthController');

const router = express.Router();

// ==================== GOOGLE OAUTH ====================
// Khởi tạo Google OAuth
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/oauth/failure',
    session: false 
  }),
  oauthController.googleCallback
);

// ==================== FACEBOOK OAUTH ====================
// Khởi tạo Facebook OAuth
router.get('/facebook',
  passport.authenticate('facebook', { 
    scope: ['email', 'public_profile'] 
  })
);

// Facebook callback
router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/api/auth/oauth/failure',
    session: false 
  }),
  oauthController.facebookCallback
);

// ==================== OAUTH FAILURE ====================
router.get('/oauth/failure', oauthController.oauthFailure);

module.exports = router;
