const express = require('express');
const { allowedTo, auth } = require('../controllers/authController');
const { getUsers, createUser, getUser, updateUser, deleteUser, changeUserPassword, uploadUserImage, resizeImage, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData } = require('../controllers/userController');
const { getUserValidator, updateUserValidator, deleteUserValidator, createUserValidator, changeUserPasswordValidator, updateLoggedUserValidator } = require('../utils/validators/userValidator');

const router = express.Router();

router.use(auth);

router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/changeMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);

router.use(allowedTo('admin'));

router.put('/changePassword/:id', changeUserPasswordValidator, changeUserPassword);

router.route('/')
  .get(allowedTo('manager'), getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;

