const express = require('express');

const {
    addToCart,
    getLoggedUserCart,
    removeCartItem,
    clearCart,
    updateItemQuantity,
    applyCoupon,
} = require(`${__dirname}/../Controller/cartController`);

const {
    addToCartValidator,
    removeCartItemValidator,
    updateItemQuantityValidator,
    applyCouponValidator,
} = require(`${__dirname}/../utils/validator/cartValidator`);

const authController = require(`${__dirname}/../Controller/authController`);

const router = express.Router();

router.use(authController.protect, authController.restrictTo('user'));

router
    .route('/')
    .post(addToCartValidator, addToCart)
    .get(getLoggedUserCart)
    .delete(clearCart);

router.put('/applyCoupon', applyCouponValidator , applyCoupon);

    router
    .route('/:itemId')
    .put(updateItemQuantityValidator, updateItemQuantity)
    .delete(removeCartItemValidator, removeCartItem);

module.exports = router;
