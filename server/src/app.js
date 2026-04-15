const express = require('express')
const app = express()

//routes
const authRoutes = require('./routes/user.routes')
const postRoutes = require('./routes/post.routes')
const connectRoutes = require('./routes/connect.routes')
const groupRoutes = require('./routes/group.routes')

//dev tools
const morgan = require('morgan')
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())


//base
app.use('/api/auth',authRoutes)
app.use('/api',postRoutes)
app.use('/api',connectRoutes)
app.use('/api',groupRoutes)


module.exports = app;