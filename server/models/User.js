//User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    profilePic: {
        type: String,
        default: '/uploads/default-profile-picture.png',
    },
    password:{
        type: String,
        required: true,
    },
    preferredCategories: {
        type: [String],
        default: [],
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);