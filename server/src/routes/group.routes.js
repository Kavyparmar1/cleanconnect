const express = require('express')
const routes = express.Router()
const groupController = require('../controller/group.controller')
const userMiddleware = require('../middleware/user.middleware')


routes.get('/groups/my',
    userMiddleware.protectMiddleware,
    groupController.getMyGroupsController)
routes.get('/groups/:groupsId',
    userMiddleware.protectMiddleware
    ,groupController.getGroupDetailsController)
routes.patch('/groups/:groupId/close',
    userMiddleware.protectMiddleware,
    groupController.closeGroupController
)    
module.exports = routes