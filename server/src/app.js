const express = require('express')
const app = express()
const authRoutes = require('./routes/user.routes')
const postRoutes = require('./routes/post.routes')
const morgan = require('morgan')
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())


//base
app.use('/api/auth',authRoutes)

app.use('/api',postRoutes)
module.exports = app;