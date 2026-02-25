import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/upload.js';

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, skills } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : [];

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, user });
});

/**
 * @route   POST /api/users/upload-avatar
 * @desc    Upload avatar image
 */
export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'jobsphere/avatars', 'image');
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true }
  );

  res.json({ success: true, user, avatar: result.secure_url });
});

/**
 * @route   POST /api/users/upload-resume
 * @desc    Upload resume (PDF) - user role only
 */
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'jobsphere/resumes', 'raw');
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resume: result.secure_url },
    { new: true }
  );

  res.json({ success: true, user, resume: result.secure_url });
});
