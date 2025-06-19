//adminController.js
const Feedback = require("../models/Feedback");
const User = require("../models/User");


exports.getAllFeedbacksForAdmin = async (req, res) => {
    try{
        const feedbacks = await Feedback.find({})
        .populate('user', 'username profilePic')
        .sort({ createdAt: -1 });

        res.json({ feedbacks });
    }catch(err){
        res.status(500).json({error: 'Server error'});
    }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
    try{
        const totalUsers = await User.countDocuments();
        const totalFeedbacks = await Feedback.countDocuments();

        const feedbacksPerCategory = await Feedback.aggregate([
            {$group: {_id: "$category", count: {$sum:1}}}
        ])

        const avgRatingData = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const averageRating = avgRatingData[0]?.avgRating || 0;

        const mostLikedFeedback = await Feedback.findOne()
        .sort({ likes: -1 })
        .populate("user", "username profilePic");

        res.json({
            totalUsers,
            totalFeedbacks,
            feedbacksPerCategory,
            averageRating,
            mostLikedFeedback,
        });

    }catch(err){
        res.status(500).json({error: 'Can not fetch stats'});
    }
}