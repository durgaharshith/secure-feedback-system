//userRoutes.js
const express = require('express');
const router = express.Router();
const {updateUserPreferences, updateProfile, getProfile} = require('../controllers/userController');
const  authenticate  = require('../middleware/auth');
const upload = require('../middleware/upload.js');
const { getLikedFeedbacks, toggleLike } = require('../controllers/feedbackController.js');
const { getCommentsByUser, deleteComment } = require('../controllers/commentController.js');


router.post('/preferences', authenticate, updateUserPreferences);
router.get('/profile', authenticate, getProfile);
router.put('/profile/update', authenticate, upload.single('profilePic'), updateProfile);
router.get('/likes', authenticate, getLikedFeedbacks);
router.get('/comments', authenticate, getCommentsByUser);
router.delete('feedbacks/:feedbackId//comments/:commentId', authenticate, deleteComment)

module.exports = router ;