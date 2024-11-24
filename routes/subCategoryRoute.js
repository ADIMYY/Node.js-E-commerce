const express = require('express');

const {
    getAllSubCategory, 
    createSubCategory, 
    getSubCategory, 
    updateSubCategory, 
    deleteSubCategory, 
    setCategoryIdToBody, 
    createFilterObject
} = require(`${__dirname}/../Controller/subCategoryController`);

const authController = require(`${__dirname}/../Controller/authController`);

const {
    createSubCategoryValidator, 
    getSubCategoryValidator, 
    updateSubCategoryValidator, 
    deleteSubCategoryValidator
} = require(`${__dirname}/../utils/validator/subCategoryValidator`);

const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(createFilterObject, getAllSubCategory)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        setCategoryIdToBody, 
        createSubCategoryValidator, 
        createSubCategory
    );

router
    .route('/:id')
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        authController.protect,
        authController.restrictTo('admin', 'manager'),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        deleteSubCategoryValidator, 
        deleteSubCategory
    );


module.exports = router;