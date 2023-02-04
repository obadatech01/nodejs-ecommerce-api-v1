const express = require('express');
const { allowedTo, auth } = require('../controllers/authController');
const { createSubCategory, getSubCategory, getSubCategories, updateSubCategory, deleteSubCategory, setCategoryIdToBody, createFilterObj } = require('../controllers/subCategoryController');
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../utils/validators/subCategoryValidator');

// mergeParams: Allow us to access parameters on other routers
// Ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(createFilterObj, getSubCategories)
  .post(auth, allowedTo('manager', 'admin'), setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router.route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(auth, allowedTo('manager', 'admin'), updateSubCategoryValidator, updateSubCategory)
  .delete(auth, allowedTo('admin'), deleteSubCategoryValidator, deleteSubCategory);


module.exports = router;

