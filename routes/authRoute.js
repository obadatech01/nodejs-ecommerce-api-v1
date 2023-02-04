const express = require('express');
const { signup, login, forgotPassword, verifyResetPasswordCode, resetPassword } = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../utils/validators/authValidator');

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetPasswordCode);
router.put('/resetPassword', resetPassword);

module.exports = router;

