const express = require('express');

const {
    getBrandValidator, 
    createBrandValidator, 
    updateBrandValidator, 
    deleteBrandValidator, 
} = require(`${__dirname}/../utils/validator/brandValidator`);

const {
    getAllBrands, 
    getBrand, 
    createBrand, 
    updateBrand, 
    deleteBrand, 
    uploadBrandImage, 
    resizeImage
} = require(`${__dirname}/../Controller/brandController`);

const authController = require(`${__dirname}/../Controller/authController`);

const router = express.Router();

router
    .route('/')
    .get(getAllBrands)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        uploadBrandImage, 
        resizeImage, 
        createBrandValidator, 
        createBrand
    );

router
    .route('/:id')
    .get(getBrandValidator, getBrand)
    .put(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        uploadBrandImage, 
        resizeImage, 
        updateBrandValidator, 
        updateBrand
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteBrandValidator, 
        deleteBrand
    );

module.exports = router;