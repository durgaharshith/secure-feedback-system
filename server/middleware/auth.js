// auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authenticate = async (req, res, next) => {
    
    const token = req.cookies.accessToken; 
    if (!token) return res.status(401).json({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('JWT verified. User ID:', decoded.id);
        if (!req.user) return res.status(401).json({ error: 'User not found' });
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Access token expired' });
        }
        res.status(401).json({ error: 'Invalid token' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

module.exports = authenticate;
module.exports.authorizeAdmin = authorizeAdmin;

