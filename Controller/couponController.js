const Coupon = require(`${__dirname}/../model/couponModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);


exports.getAllCoupons = handlerFactory.getAll(Coupon);


exports.getCoupon = handlerFactory.getOne(Coupon);


exports.createCoupon = handlerFactory.createOne(Coupon);


exports.updateCoupon = handlerFactory.updateOne(Coupon);


exports.deleteCoupon = handlerFactory.deleteOne(Coupon);