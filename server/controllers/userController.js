//userController.js

const User = require('../models/User');
const Feedback = require('../models/Feedback.js')

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password -refreshToken');
        const feedbacks = await Feedback.find({ author: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            user,
            feedbacks,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
}


exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        let { name, email, preferredCategories } = req.body;

        // Handle profilePic from upload
        let profilePic;
        if (req.file) {
            const fileBuffer = req.file.buffer;
            const fileOriginalName = req.file.originalname;
            const uploadToCloudinary = require('../utils/uploadToCloudinary');
            const uniqueName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
            profilePic = await uploadToCloudinary(fileBuffer, fileOriginalName);
        }

        // Fix: Convert stringified array to real array if needed
        if (typeof preferredCategories === 'string') {
            try {
                preferredCategories = JSON.parse(preferredCategories);
            } catch (err) {
                preferredCategories = []; // or handle error
            }
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (preferredCategories) updatedFields.preferredCategories = preferredCategories;
        if (profilePic) updatedFields.profilePic = profilePic;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true, runValidators: true }
        ).select('-password -refreshToken');

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};


exports.updateUserPreferences = async (req, res) => {
    try {
        const { preferredCategories } = req.body;
        const userId = req.user.id;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { preferredCategories },
            { new: true }
        );
        console.log('Received preference request:', req.body);
        res.status(200).json({ message: 'preferences updated successfully', updateUser });

    } catch (err) {
        res.status(400).json({ error: 'Error updating preferences' })
    }
}