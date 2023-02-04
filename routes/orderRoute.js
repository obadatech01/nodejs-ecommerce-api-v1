const express = require('express');
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require('../controllers/orderController');

const {auth, allowedTo} = require('../controllers/authController');

const router = express.Router();

router.use(auth);

router.get(
  '/checkout-session/:cartId',
  allowedTo('user'),
  checkoutSession
);

router.route('/:cartId').post(allowedTo('user'), createCashOrder);
router.get(
  '/',
  allowedTo('user', 'admin', 'manager'),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get('/:id', findSpecificOrder);

router.put(
  '/:id/pay',
  allowedTo('admin', 'manager'),
  updateOrderToPaid
);
router.put(
  '/:id/deliver',
  allowedTo('admin', 'manager'),
  updateOrderToDelivered
);

module.exports = router;