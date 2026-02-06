const express = require('express')
const routes = express.Router()
const authController = require('../controller/auth.controller')
const authMiddleware = require('../middleware/user.middleware')
routes.post('/register',authController.registerController)
routes.post('/login',authController.loginController)
routes.get('/me',authMiddleware.protectMiddleware ,authController.getMe)
module.exports = routes