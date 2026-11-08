import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'cobalt_skies_jwt_secret_key_2026_super_secure'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists',
        });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended by the fest administrator',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token. Please log in again.',
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }
};
