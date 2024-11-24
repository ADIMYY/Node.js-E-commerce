const express = require('express');

const { 
    signup,
    login,
    forgotPassword,
    verifyResetCodePassword,
    resetPassword,
} = require(`${__dirname}/../Controller/authController`);

const { 
    signupValidator,
    loginValidator
} = require(`${__dirname}/../utils/validator/authValidator`);

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCodePassword);
router.put('/resetpassword', resetPassword);


module.exports = router;