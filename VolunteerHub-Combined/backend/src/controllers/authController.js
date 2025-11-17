const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { successResponse, createdResponse, errorResponse, validationErrorResponse } = require('../utils/response');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 409, 'Email already registered');
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'volunteer',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    const userData = user.toJSON();
    createdResponse(res, 'User registered successfully', {
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Register Error:', error);
    errorResponse(res, 500, 'Registration failed: ' + error.message);
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return validationErrorResponse(res, 'Email and password are required');
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    const userData = user.toJSON();
    successResponse(res, 'Login successful', {
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    errorResponse(res, 500, 'Login failed: ' + error.message);
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    successResponse(res, 'User retrieved successfully', { user });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve user: ' + error.message);
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        phone: phone || req.user.phone,
        address: address || req.user.address,
        bio: bio || req.user.bio,
        avatar: avatar || req.user.avatar,
      },
      { new: true, runValidators: true }
    );

    successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update profile: ' + error.message);
  }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    successResponse(res, 'Users retrieved successfully', {
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve users: ' + error.message);
  }
};

// Get User By ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    successResponse(res, 'User retrieved successfully', { user });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve user: ' + error.message);
  }
};

// Deactivate User
const deactivateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    successResponse(res, 'Account deactivated successfully');
  } catch (error) {
    errorResponse(res, 500, 'Failed to deactivate account: ' + error.message);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
  deactivateUser,
};
