const { check } = require('express-validator');

const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  check('name').notEmpty().withMessage('User name is required!')
  .isLength({min: 3}).withMessage('Too short user name!')
  .custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check('email').notEmpty().withMessage('User email is required!')
  .isEmail().withMessage('Invalid email address!')
  .custom((val) =>
    User.findOne({ email: val }).then((user) => {
      if (user) {
        return Promise.reject(new Error('E-mail already in user'));
      }
    })
  ),

  check('password').notEmpty().withMessage('User password is required!')
  .isLength({min: 6}).withMessage('Password must be at least 6 characters!')
  .custom((password, {req}) => {
    if (password !== req.body.confirmPassword) {
      throw new Error('Password Confirmation incorrect!');
    }
    return true;
  }),

  check('confirmPassword').notEmpty().withMessage('User password confirmation is required!')
  .isLength({min: 6}).withMessage('Password confirmation must be at least 6 characters!'),
    
  validatorMiddleware
];

exports.loginValidator = [
  check('email').notEmpty().withMessage('User email is required!')
  .isEmail().withMessage('Invalid email address!'),

  check('password').notEmpty().withMessage('User password is required!')
  .isLength({min: 6}).withMessage('Password must be at least 6 characters!'),
  
  validatorMiddleware
];
