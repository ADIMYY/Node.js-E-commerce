const express = require('express');

const {
    getAllCoupons,
    getCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} = require(`${__dirname}/../Controller/couponController`);

const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator,
} = require(`${__dirname}/../utils/validator/couponValidator`);

const authController = require(`${__dirname}/../Controller/authController`);

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin', 'manager'));


router
    .route('/')
    .get(getAllCoupons)
    .post(createCouponValidator, createCoupon);

router
    .route('/:id')
    .get(getCouponValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon);

module.exports = router;