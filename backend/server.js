const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const cors = require('cors');
const morgan = require('morgan')
const app = express()
const { v2 } = require('cloudinary')

// connect database

connectDB();

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// init middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
// define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/message', require('./routes/api/messages'))





const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server start on port ${PORT}`)
})