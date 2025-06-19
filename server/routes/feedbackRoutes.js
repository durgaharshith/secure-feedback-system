//feedbackRouter.js
const express = require('express');
const authenticate = require('../middleware/auth.js')
const router = express.Router();
const upload = require('../middleware/upload.js')
const Feedback = require('../models/Feedback.js')
const {createFeedback, getUserFeed, getFeedbackById, updateFeedback, getExploreFeedbacks, searchFeedbacks, deleteFeedback, toggleLike, getFeedbacksByUser, getAllCategories } = require('../controllers/feedbackController.js')
const { addComment, getComments } = require('../controllers/commentController');



router.post('/createFeedback', authenticate, upload.array('images', 5), createFeedback);
router.get('/categories', (req, res) => {
  try {
    const categories = Feedback.schema.path('category').enumValues;
    const sortedCategories = [...categories].sort((a, b) => a.localeCompare(b));
    res.status(200).json(sortedCategories)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get categories', error });
  }
});
router.get('/', authenticate, getUserFeed);
router.get('/mine', authenticate, getFeedbacksByUser);
router.get('/explore', authenticate, getExploreFeedbacks);
router.get('/search', searchFeedbacks); 
router.get('/categories', getAllCategories);
router.post('/:id/like', authenticate, toggleLike)
router.get('/:id/comments', authenticate, getComments);
router.post('/:id/comments', authenticate, addComment);
router.put('/:id/edit', authenticate, upload.array('images', 5), updateFeedback);
router.get('/:id', authenticate, getFeedbackById);
router.delete('/:id', authenticate, deleteFeedback);





module.exports = router;