const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

// Nested route
// @route GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc Get list of subcategories
// @route GET /api/v1/subcategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategory, "SubCategory");

// @desc Get specific sub1category by id
// @route GET /api/v1/sub1categories/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory);

// Nested route (Create)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc Create subCategory
// @route POST /api/v1/subcategories
// @access Private/admin-manager
exports.createSubCategory = factory.createOne(SubCategory);

// @desc Update specific SubCategory
// @route PUT /api/v1/subcategories/:id
// @access Private/admin-manager
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc Delete specific SubCategory
// @route DELETE /api/v1/subcategories/:id
// @access Private/admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);
