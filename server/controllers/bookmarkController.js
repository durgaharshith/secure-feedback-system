//bookmarkController.js
const User = require('../models/User.js');
const Feedback = require('../models/Feedback.js');

exports.toggleBookmark = async (req, res) => {
    try {
        const userId = req.user._id;
        const feedbackId = req.params.feedbackId;
        const user = await User.findById(userId);
        const isBookmarked = user.bookmarks.includes(feedbackId);

        if (isBookmarked) {
            user.bookmarks.pull(feedbackId);
            await user.save();
            res.status(200).json({ message: 'Bookmark removed', feedbackId, userBookmarks: user.bookmarks });
        } else {
            user.bookmarks.push(feedbackId);
            await user.save();
            res.status(200).json({ message: 'Bookmark added', feedbackId, userBookmarks: user.bookmarks });
        }

    } catch (err) {
        res.status(500).json({ error: 'Failed to toggle bookmark' });
    }
};



exports.getBookmarks = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'bookmarks',
            populate: {
                path: 'user',
                select: 'username profilePic',
            },
        });
        const fb = await Feedback.findById("6829f8ea202e8369474df689");
        console.log(fb); // Should not be null

        res.status(200).json({ bookmarks: user.bookmarks });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get bookmarks' });
    }
};
