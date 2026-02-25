import { validationResult } from 'express-validator';

/**
 * Middleware to check validation result and send 400 if invalid
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const err = new Error('Validation failed');
  err.statusCode = 400;
  err.errors = errors.array();
  next(err);
};
