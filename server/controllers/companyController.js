import Company from '../models/Company.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/upload.js';

/**
 * @route   GET /api/companies/me
 * @desc    Get current user's company profile
 */
export const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found. Create one first.');
  }
  res.json({ success: true, company });
});

/**
 * @route   PUT /api/companies/me
 * @desc    Update company profile
 */
export const updateCompany = asyncHandler(async (req, res) => {
  let company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found.');
  }

  const { companyName, description, website } = req.body;
  const updates = {};
  if (companyName !== undefined) updates.companyName = companyName;
  if (description !== undefined) updates.description = description;
  if (website !== undefined) updates.website = website;

  company = await Company.findByIdAndUpdate(company._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, company });
});

/**
 * @route   POST /api/companies/upload-logo
 * @desc    Upload company logo
 */
export const uploadLogo = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'jobsphere/logos', 'image');
  let company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found.');
  }

  company = await Company.findByIdAndUpdate(
    company._id,
    { logo: result.secure_url },
    { new: true }
  );

  res.json({ success: true, company, logo: result.secure_url });
});

/**
 * @route   GET /api/companies/:id
 * @desc    Get company by ID (public)
 */
export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate('owner', 'name email');
  if (!company) {
    res.status(404);
    throw new Error('Company not found.');
  }
  res.json({ success: true, company });
});
