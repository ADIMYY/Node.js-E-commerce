const express = require('express');

const { 
    getAllCategories, 
    createCategory, 
    getCategory, 
    updateCategory, 
    deleteCategory, 
    uploadCategoryImage, 
    resizeImage
} = require(`${__dirname}/../Controller/categoryController`);

const authController = require(`${__dirname}/../Controller/authController`);

const { 
    getCategoryValidator,
    createCategoryValidator, 
    updateCategoryValidator, 
    deleteCategoryValidator
} = require(`${__dirname}/../utils/validator/categoryValidator`);

const subCategoryRoute = require(`${__dirname}/subCategoryRoute`);

//* Routes
const router = express.Router();

router.use('/:categoryId/subcategories', subCategoryRoute);

router
    .route('/')
    .get(getAllCategories)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        uploadCategoryImage, 
        resizeImage, 
        createCategoryValidator, 
        createCategory
    );

router
    .route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        uploadCategoryImage, 
        resizeImage, 
        updateCategoryValidator, 
        updateCategory
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteCategoryValidator, 
        deleteCategory
    );


module.exports = router;