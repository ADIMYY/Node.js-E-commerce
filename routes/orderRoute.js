const express = require('express');

const {
    createCachOrder,
    filterOrderForLoggedUser,
    getAllOrders,
    getOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    checkoutSession,
} = require(`./../Controller/orderController`);

const authController = require(`${__dirname}/../Controller/authController`);

const router = express.Router();
router.use(authController.protect);

router.get(
    '/checkout-session', 
    authController.restrictTo('user'), 
    checkoutSession
);

router
    .route('/')
    .get(
        authController.restrictTo('user', 'admin'), 
        filterOrderForLoggedUser, //! if 'user' get user order else get all orders
        getAllOrders
    )
    .post(authController.restrictTo('user'), createCachOrder);

router.route('/:id').get(getOrder);

router.put(
    '/:id/pay', 
    authController.restrictTo('admin'),
    updateOrderToPaid
);
router.put(
    '/:id/delivered', 
    authController.restrictTo('admin') , 
    updateOrderToDelivered
);

module.exports = router;