//auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authenticate = async (req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token) res.status(401).json({error: 'No Token provided'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    }catch(error){
        res.status(401).json({error: 'Invalid token'});
    }
}

module.exports = authenticate;