const mongoose = require('mongoose');

//*  1) create schema
const categorySchema = new mongoose.Schema({
        name: {
            type: String, 
            required: [true, 'Category name required'], 
            unique: [true, 'Category must be unique'], 
            minLength: [3, 'too short category name'], 
            maxLength: [32, 'too long category name']
        }, 
        slug: {
            type: String, 
            lowercase: true
        }, 
        image: String
    }, 
    { timestamps: true } // createAt, updateAt 
);


const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl;
    }
};

//! --< get all, get one, update >--
categorySchema.post('init', (doc) => {
    setImageUrl(doc);
});


//! --< create >--
categorySchema.post('save', (doc) => {
    setImageUrl(doc);
});


//* 2) create model
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;