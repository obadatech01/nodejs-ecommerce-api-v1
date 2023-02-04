const express = require('express');
const { auth, allowedTo } = require('../controllers/authController');
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand, uploadBrandImage, resizeImage } = require('../controllers/brandController');
const { getBrandValidator, updateBrandValidator, deleteBrandValidator, createBrandValidator } = require('../utils/validators/brandValidator');

const router = express.Router();

router.route('/')
  .get(getBrands)
  .post(auth, allowedTo('manager', 'admin'), uploadBrandImage, resizeImage, createBrandValidator, createBrand);

router.route('/:id')
  .get(getBrandValidator, getBrand)
  .put(auth, allowedTo('manager', 'admin'), uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(auth, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;

