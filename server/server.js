const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT||5000

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Feedback form backend is running")
})

//mongodb
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MONGODB connected");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}).catch((err)=>console.error(err))
