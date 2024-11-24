const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require(`${__dirname}/../model/userModel`);
const appError = require(`${__dirname}/../utils/appError`);
const sendEmail = require(`${__dirname}/../utils/sendEmail`);
const generateToken = require(`${__dirname}/../utils/generateToken`);


exports.signup = asyncHandler(async (req, res, next) => {
    //* Create User
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    //* Generate Token
    const token = generateToken(user._id);

    //* Send response
    res.status(201).json({
        status: 'OK',
        token,
        data: user,
    });
});


exports.login = asyncHandler(async (req, res, next) => {
    //* check if user is already existing and password is correct
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //* .select('+password') and check bu clg

    if (!user || !(await bcrypt.compare(password, user.password)))
        return next(new appError('Incorrect email or password', 401));

    //* Generate Token
    const token = generateToken(user._id);

    //* Send response
    res.status(200).json({
        status: 'OK',
        token,
        data: user,
    });
});


exports.protect = asyncHandler(async (req, res, next) => {
    //! 1] check if token exists
    let token;
    if (
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new appError('Please login to be able to access this route', 401));
    }

    //! 2] verify token is valid (no change happens, expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    //! 3] check if user exists
    const curUser = await User.findById(decoded.userId);

    if (!curUser) {
        return next(new appError('The user belonging to this token does no longer exist.', 401))
    }

    //! 4] check if user change his password after token creation
    if (curUser.passwordChangeAt) {
        const timeStamp = parseInt(
            curUser.passwordChangeAt.getTime() / 1000,
            10
        );
        
        if (timeStamp > decoded.iat) { //* Password changed
            return next(
                new appError(
                    'User recently changed his password. Please login again...', 
                    401
                )
            );
        }
    }

    req.user = curUser;
    next();
});

//! Authorization (User permissions)
exports.restrictTo = (...roles) => 
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('You do not have permission to perform this action', 403));
        }

        next();
});


exports.forgotPassword = asyncHandler(async (req, res, next) => {  
    //! 1] Get user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new appError(`There no user with this email: ${req.body.email}`, 404));
    }

    //! 2] Generate hash code (6 digits) and save in database
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    //* Saved into database
    user.hashedCode = hashedCode;
    user.hashedCodeExpires = Date.now() + 10 * 60 * 1000;
    user.hashedCodeVerified = false;

    await user.save();

    //! Send the code via email
    const message = `Hi ${user.name},\nWe recevied the request to reset the password on your E-shop account.\n${code}\nEnter this code to complete the reset`;
        
    try {
        await sendEmail({
            to: user.email,
            subject: 'Your reset password code (valid for 10 minutes)',
            text: message,
        });
    } catch (err) {
        user.hashedCode = undefined;
        user.hashedCodeExpires = undefined;
        user.hashedCodeVerified = undefined;

        await user.save();
        return next(new appError('There is an error in sending email', 500));
    }

    res.status(200).json({
        status: 'OK',
        message: 'reset code dent to e-mail',
    });
});


exports.verifyResetCodePassword = asyncHandler(async (req, res, next) => {
    //! 1] Get user based on reset code
    const hashedCode = crypto.createHash('sha256').update(req.body.code).digest('hex');

    const user = await User.findOne({ 
        hashedCode,
        hashedCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new appError('Reset Code invalid or expired', 500));
    }

    //! 2] Reset code valid
    user.hashedCodeVerified = true;
    await user.save();

    res.status(200).json({ status: 'OK' });
});


exports.resetPassword = asyncHandler(async (req, res, next) =>{
    const {email, password} = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new appError('There is no user with email', 404));
    }

    if (!user.hashedCodeVerified) {
        return next(new appError('Reset code not verified', 400));
    }

    user.password = password;
    user.hashedCode = undefined;
    user.hashedCodeExpires = undefined;
    user.hashedCodeVerified = undefined;
    
    await user.save();

    //! if Ok generate token
    const token = generateToken(user._id);

    res.status(200).json({
        status: 'OK',
        message: 'Your password has been updated successfully',
        token,
    });
});