const mongoose = require('mongoose');

const dbConnection = () => {
    const DB = process.env.DATA_BASE.replace(
        '<db_password>', 
        process.env.DB_PASSWORD
    );
    
    mongoose
        .connect(DB)
        .then(() => console.log('DB connection established'));
}

module.exports = dbConnection;