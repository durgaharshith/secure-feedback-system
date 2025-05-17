//feedbackController.js
const Feedback = require('../models/Feedback');

exports.createFeedback = async (req,res) =>{
    const {title, username, message, rating} = req.body;
    try{
       
        const imagePaths = req.files?.map(file=>file.path);
        const feedback = new Feedback({
            user: req.user._id,
            title,
            message,
            rating,
            images: imagePaths,
        })

        await feedback.save();
        res.status(201).json({message: 'Feedback submitted', feedback});
    }catch(err){
        res.status(500).json({error: 'Failed to submit feedback.'});
    }
}
