// authController.js
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
};

exports.registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;

    const DEFAULT_PROFILE_PIC_URL = 'https://res.cloudinary.com/dlyaia9da/image/upload/v1748455665/default-profile-picture_yzjwq2.png';
    let profilePic = DEFAULT_PROFILE_PIC_URL;

    if (req.file) {
        const uploadToCloudinary = require('../utils/uploadToCloudinary');
        profilePic = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    }
    
    try {
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, username, email, password: hashed, profilePic });
        await user.save();

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production', // true only in production
            sameSite: 'strict',
        });

        // Optionally, set accessToken cookie here too if desired (or send in response body)
        res.status(200).json({ message: 'User registered successfully.', accessToken });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Registration failed' });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email: username }, { username }] });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'strict',
        });

        // Set access token cookie (optional)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            secure: false,
            sameSite: 'strict',
        });

        res.status(200).json({
            message: 'User logged in successfully.',
            accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                preferredCategories: user.preferredCategories || [],
                profilePic: user.profilePic
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};

//check again
exports.refreshAccessToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'Refresh token missing' });

    try {
        // Verify the refresh token
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Find the user and validate token matches DB
        const user = await User.findById(payload.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Rotate refresh token
        const newRefreshToken = generateRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Issue new access token
        const accessToken = generateAccessToken(user._id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({ accessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};
