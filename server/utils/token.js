//token.js
const jwt = require('jsonwebtoken');

exports.generateAccessToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    });
};

exports.generateRefreshToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    });
};

exports.verifyRefreshToken = (token) =>{
    return jwt.verify(token, process.env.JWT_SECRET);
};