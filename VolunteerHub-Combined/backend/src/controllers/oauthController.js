// ==================== OAUTH CONTROLLER ====================
const jwt = require('jsonwebtoken');

// ==================== GENERATE JWT TOKEN ====================
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

// ==================== GOOGLE CALLBACK ====================
exports.googleCallback = async (req, res) => {
  try {
    // User được Passport xác thực và đính kèm vào req.user
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=authentication_failed`);
    }

    // Tạo JWT token
    const token = generateToken(user._id);

    // Chuyển hướng về frontend với token trong URL
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
  }
};

// ==================== FACEBOOK CALLBACK ====================
exports.facebookCallback = async (req, res) => {
  try {
    // User được Passport xác thực và đính kèm vào req.user
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=authentication_failed`);
    }

    // Tạo JWT token
    const token = generateToken(user._id);

    // Chuyển hướng về frontend với token trong URL
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
  }
};

// ==================== OAUTH FAILURE ====================
exports.oauthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
};
