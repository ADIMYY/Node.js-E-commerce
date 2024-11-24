const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');


const Category = require(`${__dirname}/../model/categoryModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);
const { uploadSingleImage } = require(`./../middleware/uploadImageMiddleware`);


//* Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

//* Image processing middleware
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/${fileName}`);
            
        //! Save into database
        req.body.image = fileName;
    }
    next();
});


exports.getAllCategories = handlerFactory.getAll(Category);


exports.getCategory = handlerFactory.getOne(Category);


exports.createCategory = handlerFactory.createOne(Category);


exports.updateCategory = handlerFactory.updateOne(Category);


exports.deleteCategory = handlerFactory.deleteOne(Category);