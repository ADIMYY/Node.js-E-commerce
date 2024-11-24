const mongoose = require('mongoose');

const Product = require(`${__dirname}/productModel`);

const reviewSchema = new mongoose.Schema(
    {
        title: String,
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
});


reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
    const res = await this.aggregate([
        //* Stage 1: Get all reviews on specific product.
        {
            $match: { product: productId },
        },
        //* Stage 2: Grouped reviews based product, calc avg. ratings, clac ratings quantity
        {
            $group: {
                _id: 'product',
                avgRating: { $avg: '$rating' },
                ratingsQuantity: { $sum: 1 },
            }
        }
    ]);
    
    if (res.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: res[0].avgRating,
            ratingsQuantity: res[0].ratingsQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingAndQuantity(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;