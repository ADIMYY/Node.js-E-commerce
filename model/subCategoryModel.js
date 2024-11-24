const mongoose = require('mongoose');

//* Create Schema 
const subCategorySchema = new mongoose.Schema({
        name: {
            type: String, 
            trim: true, 
            unique: [true, 'Category must be unique'], 
            minLength: [2, 'too short subCategory name'], 
            maxLength: [32, 'too long subCategory name']
        },
        slug: {
            type: String, 
            lowercase: true, 
        }, 
        category: { //! parent
            type: mongoose.Schema.ObjectId, 
            ref: 'Category', 
            required: [true, 'subCategory must belong to parent category']
        }
    }, 
    { timestamps: true }
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;