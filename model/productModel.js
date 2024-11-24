const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        title: {
            type: String, 
            required: true, 
            trim: true, 
            minLength: [3, 'too short product name'], 
            maxLength: [100, 'too long product name'], 
        }, 
        slug: {
            type: String, 
            required: true, 
            lowercase: true, 
        }, 
        description: {
            type: String, 
            required: [true, 'product description is required'], 
            minLength: [20, 'too short description'], 
        }, 
        quantity: {
            type: Number, 
            required: [true, 'product quantity is required'], 
        }, 
        sold: {
            type: Number, 
            default: 0, 
        }, 
        price: {
            type: Number, 
            required: [true, 'product price is required'], 
            trim: true, 
            max: [200000, 'Too long product price'], 
        }, 
        priceAfterDiscount: {
            type: Number, 
        }, 
        colors: [String], 
        imageCover: {
            type: String, 
            required: [true, 'product image cover is required'], 
        }, 
        images: [String], 
        category: {
            type: mongoose.Schema.ObjectId, 
            ref: 'Category', 
            required: [true, 'product must be belong to a category'], 
        }, 
        subcategory: [
            {
                type: mongoose.Schema.ObjectId, 
                ref: 'SubCategory', 
            }, 
        ], 
        brand: {
            type: mongoose.Schema.ObjectId, 
            ref: 'Brand', 
        }, 
        ratingsAverage: {
            type: Number, 
            min: [0, 'Rating must be between 0 and 5'], 
            max: [5, 'Rating must be between 0 and 5'], 
        }, 
        ratingsQuantity: {
            type: Number, 
            default: 0
        }
    }, 
    { 
        timestamps: true,
        //! to enable the virtual populate
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id',
})


productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category', 
        select: 'name -_id'
    });
    next();
});


const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const images = [];
        doc.images.forEach((img) => {
            const imgUrl = `${process.env.BASE_URL}/products/${img}`;
            images.push(imgUrl);
        });
        doc.images = images;
    }
};

//! --< get all, get one, update >--
productSchema.post('init', (doc) => {
    setImageUrl(doc);
});


//! --< create >--
productSchema.post('save', (doc) => {
    setImageUrl(doc);
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;