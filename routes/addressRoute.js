const express = require('express');

const authController = require(`${__dirname}/../Controller/authController`);

const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
} = require(`${__dirname}/../Controller/addressController`);

const {
    addAddressValidator,
    removeAddressValidator,
} = require(`${__dirname}/../utils/validator/addressValidator`);

const router = express.Router();
router.use(authController.protect, authController.restrictTo('user'));

router
    .route('/')
    .post(addAddressValidator, addAddress)
    .get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddressValidator , removeAddress);

module.exports = router;