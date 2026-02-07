const express = require('express')
const routes = express.Router()
const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage(),
})


const authMiddleware = require('../middleware/user.middleware')
const postController = require('../controller/post.controller')

routes.post('/posts',authMiddleware.protectMiddleware,upload.single('image')  ,postController.createPostController)
routes.get('/posts', postController.getCityPostsController)
module.exports = routes