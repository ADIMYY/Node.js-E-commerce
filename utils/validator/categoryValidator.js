const { check, body } = require('express-validator');
const slugify = require('slugify');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'), 
    validatorMiddleware, 
];

exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Invalid category name')
        .isLength({ max: 32})
        .withMessage('Too long ccategory name')
        .isLength({ min: 3 })
        .withMessage('Too short ccategory name')
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }), 
    validatorMiddleware, 
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'), 
    body('name').optional().custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware, 
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'), 
    validatorMiddleware, 
];