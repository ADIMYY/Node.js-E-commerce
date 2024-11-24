const express = require('express');

const {
    getAllReview,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    createFilterObject,
    setProductIdAndUserIdToBody,
} = require(`${__dirname}/../Controller/reviewController`);

const { 
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require(`${__dirname}/../utils/validator/reviewValidator`);

const authController = require(`${__dirname}/../Controller/authController`);

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(createFilterObject, getAllReview)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        setProductIdAndUserIdToBody,
        createReviewValidator, 
        createReview
    );

router
    .route('/:id')
    .get(getReviewValidator, getReview)
    .put(
        authController.protect, 
        authController.restrictTo('user'), 
        updateReviewValidator, 
        updateReview
    )
    .delete(
        authController.protect, 
        authController.restrictTo('user', 'admin'), 
        deleteReviewValidator,
        deleteReview
    );

module.exports = router;