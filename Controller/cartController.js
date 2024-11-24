const asyncHandler = require('express-async-handler');

const appError = require(`${__dirname}/../utils/appError`);
const Cart = require(`${__dirname}/../model/cartModel`);
const Product = require(`${__dirname}/../model/productModel`);
const Coupon = require(`${__dirname}/../model/couponModel`);


const calcTotalPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += (item.quantity * item.price);
    });
    cart.totalPriceAfterDiscount = undefined;
    cart.totalCartPrice = totalPrice;
}


exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);
    //* Get logged user cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        //* Create a cart
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                color,
                price: product.price,
            }]
        });
    } else {
        //* if product exist in cart, => update product quantity
        const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId && item.color === color
        );

        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
        } else {
            //* if product not exist push product to cartItems array
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
            });
        }
    }

    //* clac total card price
    calcTotalPrice(cart);
    
    await cart.save();

    res.status(200).json({
        status: 'OK',
        data: cart
    });
});


exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new appError('There is no cart for this user', 404));
    }

    res.status(200).json({
        status: 'OK',
        cart,
    });
});


exports.removeCartItem = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate( { user: req.user._id }, 
        {
            $pull: { cartItems: { _id: req.params.itemId } }
        },
        { new: true }
    );

    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({
        status: 'OK',
        numOfCart: cart.cartItems.length, 
        cart
    });
});


exports.clearCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    
    res.status(204).send();
});


exports.updateItemQuantity = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new appError('There is no cart for this user', 404));
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
        const item = cart.cartItems[itemIndex];
        item.quantity = req.body.quantity;
        cart.cartItems[itemIndex] = item;
    } else {
        return next(new appError('There is no item for this id', 404));
    }

    calcTotalPrice(cart);
    
    await cart.save();
    
    res.status(200).json({
        status: 'OK',
        numOfCart: cart.cartItems.length, 
        cart
    });
});


exports.applyCoupon = asyncHandler(async (req, res, next) => {
    //* Get coupon based on coupon name
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() }, 
    });

    if (!coupon) {
        return next(new appError('Invalid Coupon', 404));
    }

    //* Get Logged User Cart
    const cart = await Cart.findOne({ user: req.user._id });

    //* Calc price after discount
    const totalPrice = cart.totalCartPrice;
    const priceAfterDiscount = (
        totalPrice - (totalPrice * coupon.discount) / 100
    ).toFixed(2);

    cart.totalPriceAfterDiscount = priceAfterDiscount;

    await cart.save();

    res.status(200).json({
        status: 'OK',
        numOfCart: cart.cartItems.length, 
        cart
    });
});