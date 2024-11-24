const categoryRoute = require(`${__dirname}/categoryRoute`);
const subCategoryRoute = require(`${__dirname}/subCategoryRoute`);
const brandRoute = require(`${__dirname}/brandRoute`);
const productRoute = require(`${__dirname}/productRoute`);
const userRoute = require(`${__dirname}/userRoute`);
const authRoute = require(`${__dirname}/authRoute`);
const reviewRoute = require(`${__dirname}/reviewRoute`);
const wishlistRoute = require(`${__dirname}/wishlistRoute`);
const addressRoute = require(`${__dirname}/addressRoute`);
const couponRoute = require(`${__dirname}/couponRoute`);
const cartRoute = require(`${__dirname}/cartRoute`);
const orderRoute = require(`${__dirname}/orderRoute`);


const mountRoutes = (app) => {
    app.use('/api/v1/categories', categoryRoute);
    app.use('/api/v1/subCategories', subCategoryRoute);
    app.use('/api/v1/brands', brandRoute);
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1/users', userRoute);
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/reviews', reviewRoute);
    app.use('/api/v1/wishlist', wishlistRoute);
    app.use('/api/v1/addresses', addressRoute);
    app.use('/api/v1/coupons', couponRoute);
    app.use('/api/v1/carts', cartRoute);
    app.use('/api/v1/orders', orderRoute);
};

module.exports = mountRoutes;