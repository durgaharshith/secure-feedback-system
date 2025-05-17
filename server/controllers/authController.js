//authControllerr.js
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET, {expiresIn:'7d'});
};

exports.registerUser = async (req,res) => {
    const {name, email, username, password} = req.body;
    try{
        const existing = await User.findOne({$or: [{email},{username}]});
        if(existing){
            return res.status(400).json({error:'email or username already exists'})
        }
        const hashed = await bcrypt.hash(password,10);
        const user = new User({name, username, email, password: hashed});
        await user.save();

        const token = generateToken(user._id);
        res.status(200).json({message: 'User registered successfully.'});
    }catch(err) {
        res.status(400).json({error:"Registration failed"});
    }
};

exports.loginUser = async (req,res) => {
    const {login, password} = req.body;
    try{
        const user = await User.findOne({$or: [{email:login}, {username:login}]});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({error: "invalid credentials"});

        const token = generateToken(user._id);
        res.status(200).json({token, message: 'User logged in successfully.', token});
    }catch(err){
        res.status(500).json({error:"Login failed"});
    }
    
};