const { request } = require("express")
const connectRequestModel = require("../models/connect.model")
const postModel = require("../models/post.model")
const groupModel = require("../models/group.model")
async function SendConnectRequest(req, res) {
  try {

    const { postId } = req.params
    const userId = req.user._id

    // check post exists
    const post = await postModel.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      })
    }

    // prevent user connecting to own post
    if (post.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect to your own post"
      })
    }

    // create connect request
    const request = await connectRequestModel.create({
      postId,
      fromUser: userId
    })

    return res.status(201).json({
      success: true,
      message: "Connect request sent successfully",
      request
    })

  } catch (error) {

    // duplicate request error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already sent a request"
      })
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}

async function getIncomingRequestsController(req, res) {
  try {

    const { postId } = req.params
    const userId = req.user._id

    // check post exists
    const post = await postModel.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      })
    }

    // check if current user is post owner
    if (post.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only post owner can view requests"
      })
    }

    // get pending requests
    const requests = await connectRequestModel
      .find({
        postId,
        status: "pending"
      })
      .populate("fromUser", "fullName email avatar city")
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      totalRequests: requests.length,
      requests
    })

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })

  }
}

async function updateConnectRequestController(req,res){
   try {
    const { requestId } = req.params
    const {action} = req.body
    const userId = req.user._id
    
    const requests = await connectRequestModel.findById(requestId)
    if(!requests){
      return res.status(404).json({
        success: false,
        message: "Request not found"
      })
    }
const post = await postModel.findById(requests.postId)
if(!post){
  return res.status(404).json({
    success: false,
    message: "Post not found"
  })
}  
if(post.createdBy.toString() !== userId.toString()){
  return res.status(403).json({
    success: false,
    message: "Only post owner can update request"
  })
}
if(action == 'reject'){
  requests.status = "rejected"
  await requests.save()

  return res.status(200).json({
    success: true,
    message: "Request rejected"
  })
}
if(action == 'accept'){
  requests.status = "accepted"
  await requests.save()

 
}

let group = await groupModel.findOne({postId:post._id})
 if(!group){
   group = await groupModel.create({
       postId:post._id,
       members:[post.createdBy]
   })
 }
 if(!group.members.includes(requests.fromUser)){
   group.members.push(requests.fromUser)
   await group.save()
 }
  return res.status(200).json({
        success: true,
        message: "Request accepted",
        group
      })
      return res.status(400).json({
        success: false,
        message: "Invalid action"
      })
   } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })

  
   }
}


module.exports = { 
     SendConnectRequest,getIncomingRequestsController,updateConnectRequestController
}