//feedbackController.js
const { Query } = require('mongoose');
const Feedback = require('../models/Feedback');
const Comment = require('../models/Comment')
const User = require('../models/User');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

exports.createFeedback = async (req, res) => {
    const { title, message, rating, imageLinks, category } = req.body;
    if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required.' });
    }

    try {
        let uploadedUrls = [];

        if (req.files && req.files.length > 0) {
            console.log('FILES:', req.files); // Should log an array of files
            for (const file of req.files) {
                const cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);
                uploadedUrls.push(cloudinaryUrl);
            }
        }

        let linkArray = [];
        if (imageLinks) {
            if (typeof imageLinks === 'string') {
                try {
                    const parsed = JSON.parse(imageLinks);
                    if (Array.isArray(parsed)) linkArray = parsed;
                    else linkArray = [imageLinks];
                } catch {
                    linkArray = [imageLinks];
                }
            } else if (Array.isArray(imageLinks)) {
                linkArray = imageLinks;
            }
        }

        const allImages = [...uploadedUrls, ...linkArray];

        const feedback = new Feedback({
            user: req.user._id,
            category,
            title,
            message,
            rating,
            images: allImages,
        });

        await feedback.save();
        await feedback.populate('user', 'username profilePic');

        res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (err) {
        console.error('Error submitting feedback:', err);
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
};


exports.getUserFeed = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user || !user.preferredCategories || user.preferredCategories.length == 0) {
            return res.status(400).json({ error: 'No preferred category set for user' })
        }

        const totalCount = await Feedback.countDocuments({
            category: { $in: user.preferredCategories }
        });
        const totalPages = Math.ceil(totalCount / limit);

        const feedbacks = await Feedback.find({
            category: { $in: user.preferredCategories }
        }).populate('user', 'username profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        const feedbackIds = feedbacks.map(fb => fb._id);  // FIXED: Use ObjectId, not string

        const commentsCountData = await Comment.aggregate([
        { $match: { feedback: { $in: feedbackIds } } },
        { $group: { _id: '$feedback', count: { $sum: 1 } } }
        ]);

        const commentsCountMap = {};
        commentsCountData.forEach(item => {
        commentsCountMap[item._id.toString()] = item.count;
        });

        const feedbacksWithCounts = feedbacks.map(fb => ({
        ...fb.toObject(),
        commentsCount: commentsCountMap[fb._id.toString()] || 0
        }));

        console.log('➡️ Feedback IDs:', feedbackIds);
        console.log('➡️ Aggregated Comment Count:', commentsCountData);
        console.log('➡️ Comment Count Map:', commentsCountMap);
        console.log('➡️ Final Feedbacks:', feedbacksWithCounts.map(f => ({
            id: f._id,
            title: f.title,
            commentsCount: f.commentsCount
        })));

        res.status(200).json({
            message: 'Feedback fetched successfully',
            feedbacks: feedbacksWithCounts,
            pagination: {
                totalItems: totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            }
        });


    } catch (err) {
        res.status(400).json({ error: 'server error' });
    }
}

exports.getExploreFeedbacks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};

        if(req.query.search){
            query.$or = [
                {title: {$regex: req.query.search, $options: 'i'} },
                {message: {$regex: req.query.search, $options: 'i'}},
            ];
        }

        if(req.query.categories){
            const categories = req.query.categories.split(',');
            query.category = { $in: categories };
        }

        const sortField = req.query.sort || 'createdAt';
        const sortQuery = {};
        sortQuery[sortField] = -1;

        const totalItems = await Feedback.countDocuments(query);
        const feedbacks = await Feedback.find(query)
            .populate('user', 'username profilePic')
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const feedbackIds = feedbacks.map(fb => fb._id); 

        const commentsCountData = await Comment.aggregate([
        { $match: { feedback: { $in: feedbackIds } } },
        { $group: { _id: '$feedback', count: { $sum: 1 } } }
        ]);

        const commentsCountMap = {};
        commentsCountData.forEach(item => {
        commentsCountMap[item._id.toString()] = item.count;
        });

        const feedbacksWithCounts = feedbacks.map(fb => ({
        ...fb.toObject(),
        commentsCount: commentsCountMap[fb._id.toString()] || 0
        }));



        const totalPages = Math.ceil(totalItems / limit);
        res.status(200).json({
            feedbacks: feedbacksWithCounts,
            pagination: {
                totalItems,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Can not fetch explores' });
    }
}


exports.getFeedbackById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const feedback = await Feedback.findById(id)
            .populate('user', 'name email profilePic')
            .exec()

        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({
            id: feedback._id,
            title: feedback.title,
            message: feedback.message,
            rating: feedback.rating,
            images: feedback.images || [],
            category: feedback.category,
            createdAt: feedback.createdAt,
            author: {
                id: feedback.user._id,
                name: feedback.user.name,
                email: feedback.user.email,
                profilePic: feedback.user.profilePic || null,
            },
            likeCount: feedback.likes?.length || 0,
            bookmarkCount: feedback.bookmarks?.length || 0,
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}


exports.toggleLike = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const userId = req.user._id;
    const hasLiked = feedback.likes.includes(userId);

    if (hasLiked) {
      feedback.likes.pull(userId);
    } else {
      feedback.likes.push(userId);
    }

    await feedback.save();

    // Convert likes to strings to prevent mismatch in frontend comparison
    const feedbackWithStringLikes = {
      ...feedback.toObject(),
      likes: feedback.likes.map((id) => id.toString()),
    };

    res.status(200).json({
      message: hasLiked ? 'Unliked' : 'Liked',
      feedback: feedbackWithStringLikes,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error liking this feedback', error: err.message });
  }
};


exports.getLikedFeedbacks = async (req, res) => {
    try {
        const userId = req.user._id;
        const likedFeedbacks = await Feedback.find({ likes: userId })
            .populate('user', 'username profilePic')
            .sort({ createdAt: -1 });

        res.status(200).json({ likedFeedbacks });
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching liked feedbacks' });
    }
}


exports.updateFeedback = async (req, res) => {
    const { id } = req.params;
    const { title, category, rating, message } = req.body;

    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        if (feedback.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized: cannot edit this feedback' });
        }

        let updatedImages = [];

        if (req.body.existingImages) {
            try {
                const parsed = JSON.parse(req.body.existingImages);
                if (Array.isArray(parsed)) {
                    updatedImages.push(...parsed);
                }
            } catch (err) {
                console.warn("Invalid existingImages JSON:", err);
            }
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const cloudinaryUrl = await uploadToCloudinary(file.buffer, file.originalname);
                updatedImages.push(cloudinaryUrl);
            }
        }

        if (title) feedback.title = title;
        if (message) feedback.message = message;
        if (category) feedback.category = category;
        if (typeof rating !== 'undefined') feedback.rating = rating;
        if (updatedImages.length > 0) feedback.images = updatedImages;

        await feedback.save();
        res.status(200).json({ message: 'Feedback updated successfully', feedback });

    } catch (err) {
        console.error('Error updating feedback:', err);
        res.status(500).json({ error: 'Cannot update feedback' });
    }
};





exports.searchFeedbacks = async (req, res) => {
  try {
    const { q, sort, categories } = req.query;

    const query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (categories) {
      const categoryArray = categories.split(",");
      query.category = { $in: categoryArray };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "rating_asc") {
      sortOption = { rating: 1 };
    } else if (sort === "rating_desc") {
      sortOption = { rating: -1 };
    }

    const feedbacks = await Feedback.find(query)
      .populate("user", "username profilePic")
      .sort(sortOption);

    // ➕ Add comments count logic here
    const feedbackIds = feedbacks.map(fb => fb._id);

    const commentsCountData = await Comment.aggregate([
      { $match: { feedback: { $in: feedbackIds } } },
      { $group: { _id: "$feedback", count: { $sum: 1 } } }
    ]);

    const commentsCountMap = {};
    commentsCountData.forEach(item => {
      commentsCountMap[item._id.toString()] = item.count;
    });

    const feedbacksWithCounts = feedbacks.map(fb => ({
      ...fb.toObject(),
      commentsCount: commentsCountMap[fb._id.toString()] || 0
    }));

    res.status(200).json({ feedbacks: feedbacksWithCounts });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search error while searching for feedbacks." });
  }
};


//incomplete
exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'feedback not found' });
        }

        if (feedback.user.toString() != req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this feedback' });
        }

        await feedback.deleteOne();

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Cannot delete feedback' });
    }
}


exports.getFeedbacksByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Fetching feedbacks for user:", userId);
    const feedbacks = await Feedback.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ feedbacks });
  } catch (err) {
    console.error("Error fetching user's feedbacks:", err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categoriesEnum = Feedback.schema.path('category').enumValues;
    res.status(200).json({ categories: categoriesEnum });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Unable to retrieve categories." });
  }
};