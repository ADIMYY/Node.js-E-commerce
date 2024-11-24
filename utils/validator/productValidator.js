const { check, body } = require('express-validator');
const slugify = require('slugify');

const validatorMiddleware = require(`${__dirname}/../../middleware/validatorMiddleware`);
const Category = require(`${__dirname}/../../model/categoryModel`);
const SubCategory = require(`${__dirname}/../../model/subCategoryModel`);

exports.createProductValidator = [
    check('title')
        .isLength({ min: 3 })
        .withMessage('must be at least 3 characters')
        .notEmpty()
        .withMessage('product name required')
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }), 
    
    check('description')
        .notEmpty()
        .withMessage('product description required')
        .isLength({ max: 2000 })
        .withMessage('too long description'), 

    check('quantity')
        .notEmpty()
        .withMessage('product quantity required')
        .isNumeric()
        .withMessage('product quantity must be a number'), 
    
    check('sold')
        .optional()
        .isNumeric()
        .withMessage('product quantity must be a number'), 

    check('price')
        .notEmpty()
        .withMessage('price required')
        .isNumeric()
        .withMessage('price must be a number')
        .isLength({ max: 32 })
        .withMessage('to long price'), 
    
    check('priceAfterDiscount')
        .optional()
        .isNumeric()
        .withMessage('product priceAfterDiscount must be a number')
        .isFloat()
        .custom((val , {req}) => {
            if (req.body.price <= val) {
                throw new Error('priceAfterDiscount must be lower than product price')
            }
            return true;
        }), 
    
    check('colors')
        .optional()
        .isArray()
        .withMessage('colors must be a array of strings'), 
    
    check('imageCover')
        .notEmpty()
        .withMessage('product imageCover required'), 
    
    check('images')
        .optional()
        .isArray()
        .withMessage('images must be a array of strings'), 
    
    check('category')
        .notEmpty()
        .withMessage('product must belong to the category')
        .isMongoId()
        .withMessage('Invalid Id format')
        .custom(async(categoryId) => 
            await Category.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(new Error('Invalid category id'));
                }
            })
        ), 
    
    check('subcategory')
        .optional()
        .isMongoId()
        .withMessage('Invalid Id format')
        .custom(async(subcategoryId) => 
            await SubCategory.find({ _id: { $exists: true, $in: subcategoryId } }).then((result) => {
                if (result.length !== subcategoryId.length || result.length < 1) {
                    return Promise.reject(new Error('Invalid subCategory id'));
                }
            })
        )
        .custom(async(val, { req }) => {
            const subcategories = await SubCategory.find({ category: req.body.category });
            const subcategoryIds = subcategories.map(sub => sub._id.toString());
    
            if (!val.every(v => subcategoryIds.includes(v))) {
                throw new Error('subCategories do not belong to the category');
            }
        }), 
    
    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid Id format'), 
    
    check('ratingsAverage')
        .optional()
        .isNumeric()
        .withMessage('ratingsAverage must be a number')
        .isLength({ min: 1 })
        .withMessage('Rating must be between 0 and 5')
        .isLength({ max: 5 })
        .withMessage('Rating must be between 0 and 5'), 
    
    check('ratingsQuantity')
        .optional()
        .isNumeric()
        .withMessage('ratingsQuantity must be a number'),  
    validatorMiddleware
];


exports.getProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid id format'), 
        
    validatorMiddleware
];


exports.updateProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid id format'), 
    body('title')
        .optional()
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }), 
    validatorMiddleware
];


exports.deleteProductValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid id format'), 
    validatorMiddleware
];