const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: function() {
        // Password không bắt buộc nếu đăng nhập bằng OAuth
        return !this.googleId && !this.facebookId;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null/undefined không bị ràng buộc unique
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      match: [/^[\d\s\-\+\(\)]+$/, 'Please provide a valid phone number'],
    },
    address: {
      type: String,
      maxlength: [300, 'Address cannot be more than 300 characters'],
    },
    bloodType: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    },
    role: {
      type: String,
      enum: ['volunteer', 'manager', 'admin'],
      default: 'volunteer',
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    eventsCompleted: {
      type: Number,
      default: 0,
    },
    hoursContributed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
