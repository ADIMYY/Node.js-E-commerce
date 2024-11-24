const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config({ path: `${__dirname}/config.env` });
const dbConnection = require(`${__dirname}/config/database`);
const appError = require(`${__dirname}/utils/appError`);
const globalError = require(`${__dirname}/middleware/errorMiddleware`);
const { webhookCheckout } = require(`${__dirname}/Controller/orderController`);

//! Routes
const mountRoutes = require(`${__dirname}/routes`);

//! Connect to the database
dbConnection();


//! express app
const app = express();

//! Enable other domains to access application
app.use(cors());
app.options('*', cors());

//! compress all response
app.use(compression());

//! Checkout webhook
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
);

//! middleware 
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


//! Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	message: 'Too many requests from this IP, please try again later'
});

//! Apply the rate limiting middleware to all requests.
app.use('/api', limiter)

app.use(hpp({
    whitelist: [
        'price',
        'sold',
        'quantity',
        'ratingsAverage',
        'ratingsQuantity',
    ]
}));

//! Mount routes
mountRoutes(app);


app.all('*', (req, res, next) => {
    next(new appError(`Can not find this route: ${req.originalUrl}`, 400));
});


//! Global error handler middleware for express errors
app.use(globalError);


const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`listening on port ${process.env.PORT}`);
});


process.on('unhandledRejection', err => {
    console.log('Unhandled rejection 💥, Shutting down.........');
    console.log(err.name, err);
    
    server.close(() => {
        process.exit(1);
    });
});
