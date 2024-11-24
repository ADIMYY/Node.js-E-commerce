const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
        name: {
            type: String, 
            required: [true, 'brand name required'], 
            minLength: [3, 'too short brand name'], 
            maxLength: [32, 'too long brand name'], 
            unique: [true, 'brand name must be unique']
        }, 
        slug: {
            type: String, 
            lowercase: true
        }, 
        image: String
    }, 
    { timestamps: true }
);


const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

//! --< get all, get one, update >--
brandSchema.post('init', (doc) => {
    setImageUrl(doc);
});


//! --< create >--
brandSchema.post('save', (doc) => {
    setImageUrl(doc);
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;