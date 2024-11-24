const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');


const User = require(`${__dirname}/../model/userModel`);
const handlerFactory = require(`${__dirname}/handlerFactory`);
const appError = require(`${__dirname}/../utils/appError`);
const { uploadSingleImage } = require(`./../middleware/uploadImageMiddleware`);
const generateToken = require(`${__dirname}/../utils/generateToken`);


//* Upload single image
exports.uploadUserImage = uploadSingleImage('photo');

//* Image processing middleware
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`);
            //! Save into database
            req.body.photo = fileName;
    }
    
    next();
});


//* Get All Users
exports.getAllUsers = handlerFactory.getAll(User);

//* Get One User
exports.getUser = handlerFactory.getOne(User);

//* Create a new User
exports.createUser = handlerFactory.createOne(User);

//* Update a User
exports.updateUser = asyncHandler(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            slug: req.body.slug,
            phone: req.body.phone,
            email: req.body.email,
            photo: req.body.photo,
            role: req.body.role
        }, 
        {
            new: true,
        }
    );

    if (!doc) {
        return next(new appError('No document found for this id', 404));
    }

    res.status(200).json({
        status: 'OK', 
        data: doc
    });
});

//* Change a User password
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, 
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangeAt: Date.now(),
        },
        {
            new: true,
        }
    );

    if (!doc) {
        return next(new appError('No document found for this id', 404));
    }

    res.status(200).json({
        status: 'OK', 
        data: doc
    });
});

//* Delete a User
exports.deleteUser = handlerFactory.updateOne(User, {active: false});

//* Get logged user data
exports.getMe = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

//* Update Logged User Password
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
    //! Update My Password
    const user = await User.findByIdAndUpdate(req.user._id, 
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangeAt: Date.now(),
        },
        {
            new: true,
        }
    );

    //! Generate Token
    const token = generateToken(user._id);

    res.status(200).json({
        status: 'OK',
        data: user,
        token
    });
});

//* Update Logged User Password (Without Password)
exports.updateMyData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );

    res.status(200).json({
        status: 'OK',
        data: updatedUser,
    });
});

//* Delete Logged user
exports.deleteMe = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true });

    res.status(204).json({ status: 'Success' });
});