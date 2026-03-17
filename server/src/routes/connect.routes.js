const express = require('express')
const routes = express.Router()
const protect  = require('../middleware/user.middleware')
const connectController = require('../controller/connect.controller')
routes.post('/connect/:postId',protect.protectMiddleware,connectController.SendConnectRequest)
routes.get('/connect/requests/:postId',protect.protectMiddleware,connectController.getIncomingRequestsController)
routes.patch('/connect/:requestId',protect.protectMiddleware,connectController.updateConnectRequestController)
module.exports = routes 