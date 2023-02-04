const express = require("express");
const { auth, allowedTo } = require("../controllers/authController");
const { addProductToWishlist, getLoggedUserWishlist, removeProductFromWishlist } = require("../controllers/wishlistController");

const router = express.Router();

router.use(auth, allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;
