const express = require('express');
const { auth, allowedTo } = require('../controllers/authController');
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory, uploadCategoryImage, resizeImage } = require('../controllers/categoryController');
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../utils/validators/categoryValidator');

const subcategoryRoute = require('./subCategoryRoute');

const router = express.Router();

// Nested Route
router.use('/:categoryId/subcategories', subcategoryRoute);

router.route('/')
  .get(getCategories)
  .post(auth, allowedTo('manager', 'admin'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);

router.route('/:id')
  .get(getCategoryValidator, getCategory)
  .put(auth, allowedTo('manager', 'admin'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(auth, allowedTo('admin'), deleteCategoryValidator, deleteCategory);

module.exports = router;

