const jwt = require('jsonwebtoken');

const generateToken = id => 
    jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });

module.exports = generateToken;