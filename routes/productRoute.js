const express = require("express");
const { allowedTo, auth } = require("../controllers/authController");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../controllers/productController");
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require("../utils/validators/productValidator");

const reviewsProduct = require("./reviewRoute");

const router = express.Router();

// Nested Route
router.use("/:productId/reviews", reviewsProduct);

router
  .route("/")
  .get(getProducts)
  .post(
    auth,
    allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    auth,
    allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(auth, allowedTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
