import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Restrict route to given roles
 * @param  {...string} roles - Allowed roles (e.g. 'user', 'company')
 */
export const restrictTo = (...roles) => {
  return asyncHandler((req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized.');
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission to perform this action.');
    }
    next();
  });
};
