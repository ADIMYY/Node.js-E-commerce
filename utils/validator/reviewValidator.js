const { check } = require('express-validator');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);
const Review = require(`${__dirname}/../../model/reviewModel`);

exports.createReviewValidator = [
    check('title').optional(),
    check('rating')
        .notEmpty()
        .withMessage('Review Rating required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Review Rating must be between 1 and 5 inclusive'),
    check('user')
        .isMongoId()
        .withMessage('Invalid user id format'),
    check('product')
        .isMongoId()
        .withMessage('Invalid product id format')
        .custom(async (val, { req }) => {
            //* check if user is already create review before
            const review = await Review.findOne({ user: req.user._id, product: req.body.product });
            if (review) {
                return Promise.reject(new Error('You already have a review'));
            }
            return true;
        }),
    validatorMiddleware,
];


exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleware,
];


exports.updateReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            //* check review ownership before updating
            const review = await Review.findById(val);
            if (!review) {
                return Promise.reject(new Error(`There is no review with id ${val}`));
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                return Promise.reject(new Error('You are not allowed to access this action'));
            }
            return true;
        }),
    validatorMiddleware,
];


exports.deleteReviewValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            //* check review ownership before deleting
            if (req.user.role === 'user') {
                const review = await Review.findById(val);
                if (!review) {
                    return Promise.reject(new Error(`There is no review with id ${val}`));
                }
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(new Error('You are not allowed to access this action'));
                }
            }
            return true;
        }),
    validatorMiddleware,
];