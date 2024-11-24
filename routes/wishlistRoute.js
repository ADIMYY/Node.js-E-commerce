const express = require('express');

const authController = require(`${__dirname}/../Controller/authController`);

const {
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist,
} = require(`${__dirname}/../Controller/wishlistController`);

const {
    addProductToWishlistValidator,
    removeProductFromWishlistValidator,
} = require(`${__dirname}/../utils/validator/wishlistValidator`);

const router = express.Router();
router.use(authController.protect, authController.restrictTo('user'));

router
    .route('/')
    .post(addProductToWishlistValidator, addProductToWishlist)
    .get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlistValidator , removeProductFromWishlist);

module.exports = router;