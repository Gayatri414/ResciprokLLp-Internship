import User from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Protect routes - requires valid JWT access token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized. Please login.');
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('User not found.');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized. Token invalid or expired.');
  }
});

/**
 * Optional auth - attaches user if token present, does not require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = null;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user) req.user = user;
  } catch {
    // ignore invalid token
  }
  next();
});
/**
 * Role based authorization
 * Usage: restrictTo('company') or restrictTo('user','admin')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      res.status(401);
      throw new Error("You must be logged in");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("You do not have permission to perform this action");
    }

    next();
  };
};
