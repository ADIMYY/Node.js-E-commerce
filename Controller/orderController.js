const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

const factory = require(`${__dirname}/handlerFactory`);
const appError = require(`${__dirname}/../utils/appError`);
const Order = require(`${__dirname}/../model/orderModel`);
const Cart = require(`${__dirname}/../model/cartModel`);
const Product = require(`${__dirname}/../model/productModel`);
const User = require(`${__dirname}/../model/userModel`);


exports.createCachOrder = asyncHandler(async (req, res, next) => {
    //! App settings
    const taxPrice = 0;
    const shippingPrice = 0;
    
    //* Get cart depend on cartId
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new appError('There is no cart for this user', 404));
    }
    
    //* Get order price depend on cart price "check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalCartPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    
    //* Create order with paymentMethodType cash
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,
    });
    
    //* After creating order, decrement product quantity, increment product sold
    if (order) {
        const bulkOptions = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }));
        await Product.bulkWrite(bulkOptions, {});
        
        //* Clear user cart
        await Cart.findOneAndDelete({ user: req.user._id });
    }

    res.status(201).json({
        status: 'OK',
        order,
    });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') req.filterObj = { user: req.user._id };
    next();
});

exports.getAllOrders = factory.getAll(Order);


exports.getOrder = factory.getOne(Order);


exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new appError('there is no order for this user', 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.status(200).json({ status: 'OK', order });
});


exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id); 
    if (!order) {
        return next(new appError('there is no order for this user', 404));
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({ status: 'OK', order });
});


exports.checkoutSession = asyncHandler(async (req, res, next) => {
    //! App settings
    const taxPrice = 0;
    const shippingPrice = 0;
    
    //* Get User Cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new appError('There is no cart for this user', 404));
    }
    
    //* Get order price depend on cart price "check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalCartPrice;
    
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    //* Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: Math.round(totalOrderPrice * 100),
                    product_data: {
                        name: `${req.user.name}'s Order`
                    }
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id.toString(),
        metadata: req.body.shippingAddress,
    });

    //* Send session to response
    res.status(200).json({ status: 'OK', session });
});


const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const oderPrice = session.amount_total / 100;

    const cart = await Cart.findById(cartId);
    const user = await User.findOne({ email: session.customer_email });

    // 3) Create order with default paymentMethodType card
    const order = await Order.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice: oderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    });

    // 4) After creating order, decrement product quantity, increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
        }));
        await Product.bulkWrite(bulkOption, {});

      // 5) Clear cart depend on cartId
        await Cart.findByIdAndDelete(cartId);
    }
};


exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
      //  Create order
        createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
});
