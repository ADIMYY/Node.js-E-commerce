const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

dotenv.config({ path: `${__dirname}/config.env` });
const dbConnection = require(`${__dirname}/config/database`);
const appError = require(`${__dirname}/utils/appError`);
const globalError = require(`${__dirname}/middleware/errorMiddleware`);

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

//! middleware 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


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