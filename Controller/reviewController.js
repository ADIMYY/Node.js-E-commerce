const Review = require(`${__dirname}/../model/reviewModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);

//* For Nested Route
exports.createFilterObject = (req, res, next) => {
    let filterObj = {};
    if (req.params.productId) {
        filterObj = { product: req.params.productId };
    }
    req.filterObj = filterObj;
    next();
};

//* Get All Reviews
exports.getAllReview = handlerFactory.getAll(Review);

//* Get One Review
exports.getReview = handlerFactory.getOne(Review);

exports.setProductIdAndUserIdToBody = (req, res, next) => {
    //! Nested Route
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

//* Create a new Review
exports.createReview = handlerFactory.createOne(Review);

//* Update a Review
exports.updateReview = handlerFactory.updateOne(Review);

//* Delete a Review
exports.deleteReview = handlerFactory.deleteOne(Review);