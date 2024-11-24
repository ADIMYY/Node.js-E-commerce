const { check, body } = require('express-validator');
const slugify = require('slugify');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Ivalid Brand id'), 
    validatorMiddleware
];


exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Invalid brand name')
        .isLength({ max: 32})
        .withMessage('Too long brand name')
        .isLength({ min: 3 })
        .withMessage('Too short brand name')
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }), 
    validatorMiddleware, 
];


exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id'), 
    body('name').optional().custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    }), 
    validatorMiddleware, 
];


exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id'), 
    validatorMiddleware, 
];