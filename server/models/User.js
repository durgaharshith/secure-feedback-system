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
    password:{
        type: String,
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);