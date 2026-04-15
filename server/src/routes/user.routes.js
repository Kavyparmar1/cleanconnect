const express = require('express')
const routes = express.Router()
const authController = require('../controller/auth.controller')
const authMiddleware = require('../middleware/user.middleware')
const authValidator = require('../middleware/user.validator')
const rateLimit  = require('express-rate-limit')


// Rate limiter — 5 registration attempts per IP per 15 minutes
const registerLimiter = rateLimit({
    windowMs:  15 * 60 * 1000,  // 15 minutes
    max:       5,
    message: {
      success: false,
      message: "Too many registration attempts. Try again later.",
    },
    standardHeaders: true,  // sends RateLimit-* headers
    legacyHeaders:   false,
  });
  const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: {
      success: false,
      message: "Too many login attempts. Try again later.",
    },
    standardHeaders: true,  // sends RateLimit-* headers
    legacyHeaders:   false,
  });

routes.post('/register',
    registerLimiter, 
    authValidator.validateRegister ,authController.registerController)
routes.post('/login',
  loginLimiter,
  authValidator.validateLogin,
  authController.loginController)
routes.get('/me',authMiddleware.protectMiddleware ,authController.getMe)
module.exports = routes