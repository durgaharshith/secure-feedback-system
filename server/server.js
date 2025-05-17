//server.js
const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./config/db.js');
const feedbackRoutes = require('./routes/feedbackRoutes.js')
const authRoutes = require('./routes/authRoutes.js')

const app = express()
const PORT = process.env.PORT||5000

connectDB();



app.use(cors());
app.use(express.json());
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/auth', authRoutes);



app.get('/',(req,res)=>{
    res.send("Feedback form backend is running")
})

app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
})
