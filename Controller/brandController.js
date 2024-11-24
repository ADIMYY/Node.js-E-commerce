const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');


const Brand = require(`${__dirname}/../model/brandModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);
const { uploadSingleImage } = require(`./../middleware/uploadImageMiddleware`);


//* Upload single image
exports.uploadBrandImage = uploadSingleImage('image');

//* Image processing middleware
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/brands/${fileName}`);
    
    //! Save into database
    req.body.image = fileName;
    next();
});


exports.getAllBrands = handlerFactory.getAll(Brand);


exports.getBrand = handlerFactory.getOne(Brand);


exports.createBrand = handlerFactory.createOne(Brand);


exports.updateBrand = handlerFactory.updateOne(Brand);


exports.deleteBrand = handlerFactory.deleteOne(Brand);