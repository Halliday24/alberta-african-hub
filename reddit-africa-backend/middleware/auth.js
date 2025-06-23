// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to verify JWT tokens
 * Protects routes that require authentication
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied' 
      });
    }

    // Check if token follows Bearer format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ 
        message: 'Invalid token format, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (excluding password)
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found, authorization denied' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token, authorization denied' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired, please login again' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error in authentication' 
    });
  }
};

/**
 * Optional authentication middleware
 * Adds user to request if token is valid, but doesn't fail if no token
 * Useful for routes that work for both authenticated and unauthenticated users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    req.user = user || null;
    next();
    
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    req.user = null;
    next();
  }
};

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Admin authorization middleware
 * Requires authentication + admin role (for future use)
 */
const adminAuth = async (req, res, next) => {
  try {
    // First run auth middleware
    await auth(req, res, () => {});
    
    // Check if user has admin role (add isAdmin field to User model in future)
    if (!req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'Admin access required' 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error in admin authentication' 
    });
  }
};

module.exports = {
  auth,
  optionalAuth,
  generateToken,
  adminAuth
};