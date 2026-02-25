import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   POST /api/applications
 * @desc    Apply to a job (user only)
 */
export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found.');
  }

  const existing = await Application.findOne({ user: req.user._id, job: jobId });
  if (existing) {
    res.status(400);
    throw new Error('You have already applied to this job.');
  }

  const application = await Application.create({
    user: req.user._id,
    job: jobId,
  });

  await Job.findByIdAndUpdate(jobId, { $addToSet: { applicants: application._id } });

  const populated = await Application.findById(application._id)
    .populate('user', 'name email avatar resume skills')
    .populate('job', 'title company');
  res.status(201).json({ success: true, application: populated });
});

/**
 * @route   GET /api/applications/me
 * @desc    Get my applications (user)
 */
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate('job', 'title location salary company')
    .populate({ path: 'job', populate: { path: 'company', select: 'companyName logo' } })
    .sort({ appliedAt: -1 })
    .lean();

  res.json({ success: true, applications });
});

/**
 * @route   DELETE /api/applications/:id
 * @desc    Withdraw application (user - own application only)
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!application) {
    res.status(404);
    throw new Error('Application not found or you cannot withdraw it.');
  }

  await Job.findByIdAndUpdate(application.job, { $pull: { applicants: application._id } });
  await Application.findByIdAndDelete(application._id);
  res.json({ success: true, message: 'Application withdrawn.' });
});

/**
 * @route   GET /api/applications/job/:jobId
 * @desc    Get applicants for a job (company owner only)
 */
export const getApplicantsByJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found.');
  }

  const job = await Job.findOne({ _id: req.params.jobId, company: company._id });
  if (!job) {
    res.status(404);
    throw new Error('Job not found or you do not own it.');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('user', 'name email avatar resume skills')
    .sort({ appliedAt: -1 })
    .lean();

  res.json({ success: true, applications });
});

/**
 * @route   PATCH /api/applications/:id/status
 * @desc    Accept or reject application (company only)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be accepted or rejected.');
  }

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) {
    res.status(404);
    throw new Error('Application not found.');
  }

  const company = await Company.findOne({ owner: req.user._id });
  if (!company || application.job.company.toString() !== company._id.toString()) {
    res.status(403);
    throw new Error('You do not have permission to update this application.');
  }

  application.status = status;
  await application.save();

  const populated = await Application.findById(application._id)
    .populate('user', 'name email avatar resume skills')
    .populate('job', 'title company');
  res.json({ success: true, application: populated });
});
