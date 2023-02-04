const express = require("express");
const { auth, allowedTo } = require("../controllers/authController");
const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../controllers/reviewController");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
} = require("../utils/validators/reviewValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(auth, allowedTo("user"), setProductIdAndUserIdToBody, createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(auth, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(auth, allowedTo("user", "manager", "admin"), deleteReview);

module.exports = router;
