const express = require('express');

const {
    getAllProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    uploadProductImage,
    resizeProductImages,
} = require(`${__dirname}/../Controller/productController`);

const authController = require(`${__dirname}/../Controller/authController`);

const {
    createProductValidator, 
    getProductValidator, 
    updateProductValidator, 
    deleteProductValidator, 
} = require(`${__dirname}/../utils/validator/productValidator`);

const reviewRoute = require(`${__dirname}/reviewRoute`);

//* Routes
const router = express.Router();

//* Nested Route
router.use('/:productId/reviews', reviewRoute);

router
    .route('/')
    .get(getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        uploadProductImage,
        resizeProductImages,
        createProductValidator, 
        createProduct
    );

router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        uploadProductImage,
        resizeProductImages,
        updateProductValidator, 
        updateProduct
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteProductValidator, 
        deleteProduct
    );

module.exports = router;