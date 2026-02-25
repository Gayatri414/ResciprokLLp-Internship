import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { register, login, refreshToken, logout, getMe } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'company']).withMessage('Role must be user or company'),
  body('companyName').optional().trim(),
  body('description').optional().trim(),
  body('website').optional().trim().isURL().withMessage('Invalid website URL').optional({ values: 'falsy' }),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, validate, asyncHandler(register));
router.post('/login', loginValidation, validate, asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));
router.get('/me', protect, asyncHandler(getMe));

export default router;
