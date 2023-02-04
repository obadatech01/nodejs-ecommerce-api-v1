const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const { default: slugify } = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
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

  check('phone').optional()
  .isMobilePhone(['ar-PS']).withMessage('Invalid phone number only accepted PS phone numbers!'),
  
  check('profileImg').optional(),
  check('role').optional(),
    
  validatorMiddleware
];

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format!'),
  validatorMiddleware
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format!'),
  body('name').optional().custom((val, {req}) => {
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

  check('phone').optional()
  .isMobilePhone(['ar-PS']).withMessage('Invalid phone number only accepted PS phone numbers!'),
  
  check('profileImg').optional(),
  check('role').optional(),

  validatorMiddleware
];

exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid user id format!'),
  body('currentPassword').notEmpty().withMessage('You must enter your current password!'),
  body('confirmPassword').notEmpty().withMessage('You must enter password confirm!'),
  body('password').notEmpty().withMessage('You must enter your new password!')
  .custom(async (val, {req}) => {
    // 1) Verify current password
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error('There is no user for this id!')
    }
    const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isCorrectPassword) {
      throw new Error('Incorrect current password!');
    }

    // 2) Verify password confirm
    if (val !== req.body.confirmPassword) {
      throw new Error('Password confirmation incorrect!')
    }
    return true;
  }),

  validatorMiddleware
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id format!'),
  validatorMiddleware
];

exports.updateLoggedUserValidator = [
  body('name').optional().custom((val, {req}) => {
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

  check('phone').optional()
  .isMobilePhone(['ar-PS']).withMessage('Invalid phone number only accepted PS phone numbers!'),
  
  validatorMiddleware
];