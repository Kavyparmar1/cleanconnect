const groupModel = require('../models/group.model')
const userModel = require('../models/user.model')



async function getMyGroupsController(req,res){
   try {
    const userId = req.user._id
    console.log(userId)
    const group = await groupModel
    .find({members:userId})
    .populate("postId","description imageUrl status city")
    .populate("members","fullname avatar")
    .sort({createdAt: -1})
    .lean()

    return res.status(200).json({
        success: true,
        totalGroups: group.length,
        group
    })
   } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Server error",
        error:error.message
    })}}
async function getGroupDetailsController(req,res){
   try {
    const {groupsId} = req.params
    const userId = req.user._id
    const group = await groupModel
    .findById(groupsId)
    .populate("members", "fullName avatar")
    .populate("postId", "description imageUrl status city")
    .lean()

    if (!group) {
       return res.status(404).json({
         success: false,
         message: "Group not found"
       })
     }
 
const isMember = group.members.some(
   member=>member._id.toString() === userId.toString()
)  
if (!isMember) {
   return res.status(403).json({
     success: false,
     message: "Access denied. Not a group member"
   })
 }

 return res.status(200).json({
   success: true,
   group
 })
   } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      })
  
    
   }
}
async function closeGroupController(req,res){
   try {
    const {groupId} = req.params
    const userId = req.user._id

    const group = await groupModel.findById(groupId)
    if(!group){
        return res.status(404).json({
            success: false,
            message: "Group not found"
          })
    }
    const post = await groupModel.findById(group.postId)
    if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        })
      }

      if (
        post.createdBy.toString() !== userId.toString() &&
        req.user.role !== "authority"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to close this group"
        })
      }
  
      // close group
      group.isActive = false
      await group.save()
  
      return res.status(200).json({
        success: true,
        message: "Group closed successfully"
      })
   } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      })
   }
}

module.exports = { getMyGroupsController,getGroupDetailsController,closeGroupController}