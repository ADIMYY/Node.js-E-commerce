const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        expire: {
            type: Date,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);