const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const createToken = require("../utils/createToken");

// Upload a single image
exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  
  if (req.file) {
    await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({quality: 95}).toFile(`uploads/users/${filename}`);
  }

  // Save image into db
  req.body.profileImg = filename;

  next();
});

// @desc Get list of users
// @route GET /api/v1/users
// @access Private/admin-manager
exports.getUsers = factory.getAll(User, 'User');

// @desc Get specific user by id
// @route GET /api/v1/users/:id
// @access Private/admin
exports.getUser = factory.getOne(User);

// @desc Create user
// @route POST /api/v1/users
// @access Private/admin
exports.createUser = factory.createOne(User);

// @desc Update specific user 
// @route PUT /api/v1/users/:id
// @access Private/admin
// exports.updateUser = factory.updateOne(User);
exports.updateUser = asyncHandler( async(req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    profileImg: req.body.profileImg,
    role: req.body.role
  }, {new: true});
  if (!user) return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  res.status(200).json({ data: user});
});

// @desc Update specific user password 
// @route PUT /api/v1/users/changePassword/:id
// @access Private
exports.changeUserPassword = asyncHandler( async(req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangedAt: Date.now()
  }, {new: true});
  if (!user) return next(new ApiError(`No user for this id ${req.params.id}`, 404));
  res.status(200).json({ data: user});
});

// @desc Delete specific user 
// @route DELETE /api/v1/users/:id
// @access Private/admin
exports.deleteUser = factory.deleteOne(User);

// @desc Get Logged User Data
// @route GET /api/v1/users/getMe
// @access Private/auth
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update Logged User Password
// @route PUT /api/v1/users/updateMyPassword
// @access Private/auth
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.password, 12),
    passwordChangedAt: Date.now()
  }, {new: true});

  // 2) Generate Token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token});
});

// @desc Update Logged User Date (without password, role)
// @route PUT /api/v1/users/updateMe
// @access Private/auth
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  }, {new: true});

  res.status(200).json({data: updateUser});
});

// @desc Deactivate Logged User
// @route DELETE /api/v1/users/deleteMe
// @access Private/auth
exports.deleteLoggedUserData = asyncHandler( async(req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {active: false});

  res.status(204).json({status: 'Success'});
});