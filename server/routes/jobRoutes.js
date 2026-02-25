import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyCompanyJobs,
} from '../controllers/jobController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const createUpdateValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('salary').optional().trim(),
  body('skillsRequired').optional().isArray().withMessage('skillsRequired must be an array'),
];

// Public
router.get('/', asyncHandler(getJobs));
// Must be before /:id
router.get('/company/mine', protect, restrictTo('company'), asyncHandler(getMyCompanyJobs));
router.get('/:id', asyncHandler(getJobById));

// Protected - company only
router.post('/', protect, restrictTo('company'), createUpdateValidation, validate, asyncHandler(createJob));
router.put('/:id', protect, restrictTo('company'), createUpdateValidation, validate, asyncHandler(updateJob));
router.delete('/:id', protect, restrictTo('company'), asyncHandler(deleteJob));

export default router;
