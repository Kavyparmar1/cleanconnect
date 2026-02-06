const express = require('express')
const routes = express.Router()
const authMiddleware = require('../middleware/user.middleware')
const postController = require('../controller/post.controller')
routes.post('/posts',authMiddleware.protectMiddleware,postController.createPostController)
routes.get('/posts', postController.getCityPostsController)
module.exports = routes