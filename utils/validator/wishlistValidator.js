const { body, param } = require('express-validator');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);

exports.addProductToWishlistValidator = [
    body('productId')
        .notEmpty()
        .withMessage('Please enter productId')
        .isMongoId()
        .withMessage('Invalid mongoId'),
    validatorMiddleware
];


exports.removeProductFromWishlistValidator = [
    param('productId')
        .notEmpty()
        .withMessage('Please enter productId')
        .isMongoId()
        .withMessage('Invalid mongoId'),
    validatorMiddleware
];