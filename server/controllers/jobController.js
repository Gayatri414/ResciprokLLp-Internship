import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs (with search, filter, pagination)
 */
export const getJobs = asyncHandler(async (req, res) => {
  const { search, location, skills, page = 1, limit = 10 } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
      { skillsRequired: new RegExp(search, 'i') },
    ];
  }
  if (location) query.location = new RegExp(location, 'i');
  if (skills) {
    const skillArr = skills.split(',').map((s) => s.trim()).filter(Boolean);
    if (skillArr.length) query.skillsRequired = { $in: skillArr };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    Job.find(query).populate('company', 'companyName logo').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Job.countDocuments(query),
  ]);

  res.json({
    success: true,
    jobs,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

/**
 * @route   GET /api/jobs/:id
 * @desc    Get single job by ID
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'companyName logo description website owner');
  if (!job) {
    res.status(404);
    throw new Error('Job not found.');
  }
  res.json({ success: true, job });
});

/**
 * @route   POST /api/jobs
 * @desc    Create job (company only)
 */
export const createJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found. Create company profile first.');
  }

  const job = await Job.create({
    ...req.body,
    company: company._id,
  });

  const populated = await Job.findById(job._id).populate('company', 'companyName logo');
  res.status(201).json({ success: true, job: populated });
});

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job (company owner only)
 */
export const updateJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found.');
  }

  const job = await Job.findOne({ _id: req.params.id, company: company._id });
  if (!job) {
    res.status(404);
    throw new Error('Job not found or you do not own it.');
  }

  const { title, description, location, salary, skillsRequired } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (location !== undefined) updates.location = location;
  if (salary !== undefined) updates.salary = salary;
  if (skillsRequired !== undefined) updates.skillsRequired = skillsRequired;

  const updated = await Job.findByIdAndUpdate(job._id, updates, { new: true }).populate('company', 'companyName logo');
  res.json({ success: true, job: updated });
});

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job (company owner only)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found.');
  }

  const job = await Job.findOne({ _id: req.params.id, company: company._id });
  if (!job) {
    res.status(404);
    throw new Error('Job not found or you do not own it.');
  }

  await Application.deleteMany({ job: job._id });
  await Job.findByIdAndDelete(job._id);
  res.json({ success: true, message: 'Job deleted.' });
});

/**
 * @route   GET /api/jobs/company/mine
 * @desc    Get jobs posted by my company
 */
export const getMyCompanyJobs = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found.');
  }

  const jobs = await Job.find({ company: company._id })
    .populate('company', 'companyName logo')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, jobs });
});
