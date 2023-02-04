const express = require('express');
const { addAddress, getLoggedUserAddresses, removeAddress } = require('../controllers/addressController');
const { auth, allowedTo } = require('../controllers/authController');

const router = express.Router();

router.use(auth, allowedTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;