//server.js
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db.js');
const feedbackRoutes = require('./routes/feedbackRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const bookmarkRoutes = require('./routes/bookmarkRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow only frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Optional: serve static uploads if you ever need it (for legacy)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', bookmarkRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send("Feedback platform backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
