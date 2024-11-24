const { body, param } = require('express-validator');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);

exports.getCouponValidator = [
    param('id').isMongoId().withMessage('Ivalid Brand id'), 
    validatorMiddleware
];


exports.createCouponValidator = [
    body('name').notEmpty().withMessage('Name of coupon required'),
    body('expire').notEmpty().withMessage('expire time of coupon required'),
    body('discount').notEmpty().withMessage('discount required'),
    validatorMiddleware
];


exports.updateCouponValidator = [
    param('id').isMongoId().withMessage('Invalid coupon id'),
    validatorMiddleware
];


exports.deleteCouponValidator = [
    param('id').isMongoId().withMessage('Invalid coupon id'),
    validatorMiddleware
];