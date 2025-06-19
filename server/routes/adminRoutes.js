//adminRoutes.js
const express = require('express');
const router = express.Router();
const {getAllFeedbacksForAdmin, getAllUsers, getAdminStats}  = require("../controllers/adminController.js");
const authenticate = require("../middleware/auth.js");
const authorizeAdmin  = require("../middleware/auth");



router.get('/dashboard', authenticate, authorizeAdmin, getAllFeedbacksForAdmin);
router.get('/allusers', authenticate, authorizeAdmin, getAllUsers);
router.get('/stats', authenticate, authorizeAdmin, getAdminStats);



module.exports = router;