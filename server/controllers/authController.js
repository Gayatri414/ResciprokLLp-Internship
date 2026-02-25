import User from '../models/User.js';
import Company from '../models/Company.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * @route   POST /api/auth/register
 * @desc    Register user or company
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user', companyName, description, website } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (role === 'company' && companyName) {
    await Company.create({
      companyName,
      description: description || '',
      website: website || '',
      owner: user._id,
    });
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 min
  res.cookie('refreshToken', refreshToken, cookieOptions);

  const userObj = user.toObject();
  delete userObj.password;

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: userObj,
    accessToken,
    refreshToken,
    expiresIn: '15m',
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);

  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    success: true,
    message: 'Login successful',
    user: userObj,
    accessToken,
    refreshToken,
    expiresIn: '15m',
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token (rotation)
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('Refresh token required.');
  }

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found.');
  }

  const accessToken = generateAccessToken({ id: user._id });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  res.json({
    success: true,
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: '15m',
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout - clear cookies
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('accessToken', '', { maxAge: 0 });
  res.cookie('refreshToken', '', { maxAge: 0 });
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user (protected)
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
});
