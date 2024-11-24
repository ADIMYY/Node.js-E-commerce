const asyncHandler = require('express-async-handler');

const User = require(`${__dirname}/../model/userModel`);

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    //! $addToSet => Add productId to wishlist (without duplicate).
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet: { wishlist: req.body.productId }
        }, 
        { new: true },
    );

    res.status(200).json({
        status: 'OK',
        message: 'product added to your wishlist',
        wishlist: user.wishlist,
    });
});


exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    //! $addToSet => remove productId to wishlist.
    const user = await User.findByIdAndUpdate(req.user._id, 
        {
            $pull: { wishlist: req.params.productId },
        },
        { new: true },
    );

    res.status(200).json({
        status: 'OK',
        message: 'product remove from your wishlist',
        wishlist: user.wishlist,
    });
});


exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
        status: 'OK',
        result: user.wishlist.length,
        wishlist: user.wishlist,
    });
});