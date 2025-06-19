//authRoutes.js
const express = require('express');
const router = express.Router();

const {registerUser, loginUser, refreshAccessToken} = require('../controllers/authController.js');
const upload = require('../middleware/upload.js');
const { forgotPassword, resetPassword } = require('../controllers/passwordController.js');

router.post('/register', upload.single('profilePic'), registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports = router;
