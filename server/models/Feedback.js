//Feedback.js
const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    message:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        min: 0,
        max: 10,
        default: null,
    },
    images: [
        {
            type: String,
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;