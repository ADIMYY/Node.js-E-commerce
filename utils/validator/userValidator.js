const slugify = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const validatorMiddleware = require(`./../../middleware/validatorMiddleware`);
const User = require(`./../../model/userModel`);


exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware
];


exports.createUserValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Name Required')
        .isLength({ min: 3 })
        .withMessage('Too short user name')
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
        }),
    check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (val) => {
            await User.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject(new Error('Email already in use'));
                }
            });
        }),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .custom((pass, {req}) => {
            if (pass !== req.body.passwordConfirmation)
                throw new Error('password confirmation incorrect');
            return true;
        }),
    check('passwordConfirmation')
        .notEmpty()
        .withMessage('password confirmation required'),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number'),
    check('photo').optional(),
    check('role').optional(),
    validatorMiddleware
];


exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id'), 
    body('name')
        .optional()
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }), 
    check('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (val) => {
            await User.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject(new Error('Email already in use'));
                }
            });
        }),
    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number'),
    check('photo').optional(),
    check('role').optional(),
    validatorMiddleware, 
];


exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id'), 
    body('currentPassword')
        .notEmpty()
        .withMessage('you must enter your current password !'),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('you must enter your password confirm'),
    body('password')
        .notEmpty()
        .withMessage('you must enter your password')
        .custom(async(val, {req}) => {
            // 1] verify current password
            const user  = await User.findById(req.params.id);
            if (!user)
                throw new Error('ther is no user with this id');
            
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword, 
                user.password
            );
            if (!isCorrectPassword)
                throw new Error('your currnt password is incorrect');
            // 2] password confirmation === current password
            if (val !== req.body.passwordConfirm)
                throw new Error('password confirmation incorrect');

            return true;
        }),
    validatorMiddleware, 
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id'), 
    validatorMiddleware, 
];


exports.updateLoggedUserValidator = [
    body('name')
        .optional()
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }), 
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(async (val) => {
            await User.findOne({ email: val }).then(user => {
                if (user) {
                    return Promise.reject(new Error('Email already in use'));
                }
            });
        }),
    body('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number'),
    validatorMiddleware, 
];