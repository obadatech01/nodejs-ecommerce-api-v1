const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

// Upload a single image
exports.uploadBrandImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer).resize(600, 600).toFormat('jpeg').jpeg({quality: 95}).toFile(`uploads/brands/${filename}`);

  // Save image into db
  req.body.image = filename;

  next();
});

// @desc Get list of brands
// @route GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(Brand, 'Brand');

// @desc Get specific brand by id
// @route GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc Create brand
// @route POST /api/v1/brands
// @access Private/admin-manager
exports.createBrand = factory.createOne(Brand);

// @desc Update specific brand 
// @route PUT /api/v1/brands/:id
// @access Private/admin-manager
exports.updateBrand = factory.updateOne(Brand);

// @desc Delete specific brand 
// @route DELETE /api/v1/brands/:id
// @access Private/admin
exports.deleteBrand = factory.deleteOne(Brand);