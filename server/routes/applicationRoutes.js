import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicantsByJob,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);

const applyValidation = [body('jobId').isMongoId().withMessage('Valid job ID is required')];
const statusValidation = [
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
];

// User: apply, my applications, withdraw
router.post('/', restrictTo('user'), applyValidation, validate, asyncHandler(applyToJob));
router.get('/me', restrictTo('user'), asyncHandler(getMyApplications));
router.delete('/:id', restrictTo('user'), asyncHandler(withdrawApplication));

// Company: view applicants, accept/reject
router.get('/job/:jobId', restrictTo('company'), asyncHandler(getApplicantsByJob));
router.patch('/:id/status', restrictTo('company'), statusValidation, validate, asyncHandler(updateApplicationStatus));

export default router;
