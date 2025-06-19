// routes/bookmarkRoutes.js
const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks } = require('../controllers/bookmarkController.js');
const authenticate = require('../middleware/auth.js');

router.post('/:feedbackId/bookmark', authenticate, toggleBookmark);
router.get('/userbookmarks', authenticate, getBookmarks);

module.exports = router;
