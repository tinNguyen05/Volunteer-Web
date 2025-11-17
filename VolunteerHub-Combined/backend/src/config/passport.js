// ==================== PASSPORT OAUTH CONFIG ====================
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// ==================== GOOGLE STRATEGY ====================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Tìm user đã tồn tại
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // User đã tồn tại, cập nhật Google ID nếu chưa có
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Tạo user mới
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        fullName: profile.displayName,
        avatar: profile.photos[0]?.value,
        role: 'volunteer',
        password: 'oauth-user-' + Date.now(), // Random password
        isActive: true
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

// ==================== FACEBOOK STRATEGY ====================
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'your-facebook-app-id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'your-facebook-app-secret',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5000/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Tìm user đã tồn tại
      let user = await User.findOne({ 
        $or: [
          { facebookId: profile.id },
          { email: profile.emails?.[0]?.value }
        ]
      });

      if (user) {
        // User đã tồn tại, cập nhật Facebook ID nếu chưa có
        if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Tạo user mới
      user = await User.create({
        facebookId: profile.id,
        email: profile.emails?.[0]?.value || `facebook_${profile.id}@placeholder.com`,
        fullName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        role: 'volunteer',
        password: 'oauth-user-' + Date.now(), // Random password
        isActive: true
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

// ==================== SERIALIZE/DESERIALIZE ====================
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
