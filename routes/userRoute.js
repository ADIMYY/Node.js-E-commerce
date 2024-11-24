const express = require('express');

const authController = require(`${__dirname}/../Controller/authController`);

const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeImage,
    changeUserPassword,
    getMe,
    updateMyPassword,
    updateMyData,
    deleteMe,
} = require(`${__dirname}/../Controller/userController`);


const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator,
} = require(`${__dirname}/../utils/validator/userValidator`);

const router = express.Router();

router.use(authController.protect);

router.get('/getMe', getMe, getUser);
router.put('/updateMyPassword', updateMyPassword);
router.put('/updateMyData', updateLoggedUserValidator, updateMyData);
router.delete('/deleteMe', deleteMe);

router.use(authController.restrictTo('admin'));

router.put(
    '/changePassword/:id',
    changeUserPasswordValidator,
    changeUserPassword
);

router
    .route('/')
    .get(getAllUsers)
    .post(
        uploadUserImage, 
        resizeImage, 
        createUserValidator, 
        createUser
    );


router
    .route('/:id')
    .get(getUserValidator, getUser)
    .put(
        uploadUserImage, 
        resizeImage, 
        updateUserValidator, 
        updateUser
    )
    .delete(deleteUserValidator, deleteUser);


module.exports = router;