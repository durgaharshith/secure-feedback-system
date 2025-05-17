//feedbackRouter.js
const express = require('express');
const authenticate = require('../middleware/auth.js')
const router = express.Router();
const upload = require('../middleware/upload.js')
const Feedback = require('../models/Feedback.js')
const {createFeedback } = require('../controllers/feedbackController.js')

router.post('/',authenticate, upload.array('images'), createFeedback)

module.exports = router;