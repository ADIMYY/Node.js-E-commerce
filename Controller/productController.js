const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');

const Product = require(`${__dirname}/../model/productModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);
const { uploadMixImage } = require(`${__dirname}/../middleware/uploadImageMiddleware`);



exports.uploadProductImage = uploadMixImage([
    {
        name: 'imageCover', 
        maxCount: 1,
    },
    {
        name: 'images', 
        maxCount: 5,
    },
]);


exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    // console.log(req.files);
    //* Image processing for imageCover
    if (req.files.imageCover) {
        const fileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${fileName}`);
        
        //! Save into database
        req.body.imageCover = fileName;
    }
    //* Image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`uploads/products/${fileName}`);
            
                //! Save into database
                req.body.images.push(fileName);
            })
        );
    }
    next();
});

exports.getAllProducts = handlerFactory.getAll(Product);


exports.getProduct = handlerFactory.getOne(Product, 'reviews');


exports.createProduct = handlerFactory.createOne(Product);


exports.updateProduct = handlerFactory.updateOne(Product);


exports.deleteProduct = handlerFactory.deleteOne(Product);