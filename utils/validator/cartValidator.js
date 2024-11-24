const { body, param } = require('express-validator');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);

exports.addToCartValidator = [
    body('productId').isMongoId().withMessage('Invalid product id'),
    validatorMiddleware
];


exports.removeCartItemValidator = [
    param('itemId').isMongoId().withMessage('Invalid item id'),
    validatorMiddleware
];


exports.updateItemQuantityValidator = [
    param('itemId').isMongoId().withMessage('Invalid item id'),
    validatorMiddleware
];


exports.applyCouponValidator = [
    body('coupon').notEmpty().withMessage('Please enter a valid coupon'),
    validatorMiddleware
];