//commentController.js
const Comment = require('../models/Comment.js');
const User = require('../models/User.js');
const Feedback = require('../models/Feedback.js');

exports.getComments = async (req,res) => {
    try{
        const feedbackId = req.params.id;
        const comment = await Comment.find({feedback: feedbackId}).populate('user', 'username profilePic').sort({createdAt: -1});

        res.status(200).json({comment});
    }catch(err){
        res.status(500).json({message: "Failed to fetch comments"});
    }
}


exports.addComment = async (req,res) => {
    try{
        const feedbackId = req.params.id;
        const {text} = req.body;

        if(!text||text.trim() ===' '){
            return res.status(400).json({error: 'Comment text is required'});
        }

        const feedback = await Feedback.findById(feedbackId);

        if(!feedback){
            return res.status(400).json({error: 'Feedback not found'});
        }

        const comment = new Comment({
            feedback: feedbackId,
            user: req.user._id,
            text,
        })
        await comment.save();

        const populateComment = await Comment.findById(comment._id).populate('user', 'username profilePic');

        res.status(201).json({message: 'Comment added',comment: populateComment});
    }catch(err){
        res.status(500).json({error: 'Failed to add comment'});
    }
}


exports.getCommentsByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const comments = await Comment.find({ user: userId })
            .populate('feedback', 'title _id')
            .sort({ createdAt: -1 });

        res.status(200).json({ comments });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch comments by user' });
    }
};


exports.deleteComment = async (req, res) => {
    const { feedbackId, commentId } = req.params;
    const userId = req.user._id;

    try {
        const feedback = await Feedback.findById(feedbackId);

        if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
        }

        const comment = feedback.comments.id(commentId);

        if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.remove();
        await feedback.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Cannot delete comment' });
    }
};