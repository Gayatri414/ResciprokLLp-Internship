import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
} from '../controllers/userController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);

const updateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
];

router.get('/profile', asyncHandler(getProfile));
router.put('/profile', updateValidation, validate, asyncHandler(updateProfile));
router.post('/upload-avatar', upload.single('avatar'), asyncHandler(uploadAvatar));
router.post('/upload-resume', restrictTo('user'), upload.single('resume'), asyncHandler(uploadResume));

export default router;
