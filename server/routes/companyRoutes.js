import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utils/upload.js';
import {
  getMyCompany,
  updateCompany,
  uploadLogo,
  getCompanyById,
} from '../controllers/companyController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const updateValidation = [
  body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('description').optional().trim(),
  body('website').optional().trim().isURL().withMessage('Invalid URL').optional({ values: 'falsy' }),
];

// Protected company routes (must be before /:id so /me is not matched as id)
router.get('/me', protect, restrictTo('company'), asyncHandler(getMyCompany));
router.put('/me', protect, restrictTo('company'), updateValidation, validate, asyncHandler(updateCompany));
router.post('/me/upload-logo', protect, restrictTo('company'), upload.single('logo'), asyncHandler(uploadLogo));

// Public: get company by ID
router.get('/:id', asyncHandler(getCompanyById));

export default router;
