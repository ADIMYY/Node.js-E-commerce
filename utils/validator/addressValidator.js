const { body, param } = require('express-validator');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);


exports.addAddressValidator = [
    body('alias')
        .notEmpty()
        .withMessage('please enter alais')
        .custom((val, { req }) => {
            const isUnique = req.user.addresses.some(el => el.alias === val);
            if (isUnique) {
                throw new Error('You already added an address for this alias.')
            }
            return true;
        }),
    body('details').notEmpty().withMessage('please enter your address details'),
    body('phone')
        .notEmpty()
        .withMessage('please enter your phone number')
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone number'),
    body('city').notEmpty().withMessage('please enter your city'),
    body('postalcode')
        .notEmpty()
        .withMessage('please enter your city postalcode')
        .matches(/^(\d{5})$/)
        .withMessage('Egyptian postal code must be a 5-digit number')
        .custom((val) => {
            const validPrefixes = ['11', '12', '13', '14', '15', '16', '17', '18', '19'];
            const prefix = val.substring(0, 2);
            if (!validPrefixes.includes(prefix)) {
                throw new Error('Invalid Egyptian postal code prefix');
            }
            return true;
        }),
    validatorMiddleware
];


exports.removeAddressValidator = [
    param('addressId')
        .notEmpty()
        .withMessage('addressId required')
        .isMongoId()
        .withMessage('Invalid mongoId'),
    validatorMiddleware
];