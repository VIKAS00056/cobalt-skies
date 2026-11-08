import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    Register a new participant
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, college, usn } = req.body;

    if (!name || !email || !password || !phone || !college) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Password, Phone, College).',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      college,
      usn: usn || '',
      role: 'user',
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Cobalt Skies 2026.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        usn: user.usn,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password.',
      });
    }

    // Explicitly select password field which is set to select: false
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact the fest desk.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        usn: user.usn,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.college = req.body.college || user.college;
    user.usn = req.body.usn !== undefined ? req.body.usn : user.usn;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id, updatedUser.role);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        college: updatedUser.college,
        usn: updatedUser.usn,
        role: updatedUser.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password verification endpoint
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond with success message to prevent user enumeration
    res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been generated. (In production, an email is dispatched; for local testing, please contact the fest admin).',
    });
  } catch (error) {
    next(error);
  }
};
