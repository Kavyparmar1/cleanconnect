const postModel = require("../models/post.model")
const storageService = require("../services/storage.service")
async function createPostController(req, res) {
  try {
    const { description, category, location, city } = req.body
    const userId = req.user._id   // from protect middleware
    if (!req.file) {
      return res.status(400).json({
        message: "Image required"
      })
    }
const imageUrl = await storageService.uploadFile(req.file.buffer)
    
console.log(req.file);
const parsedLocation = JSON.parse(location)
const post = await postModel.create({
  imageUrl,
  description,
  category,
  location: {
    lat: parsedLocation.lat,
    lng: parsedLocation.lng,
    areaName: parsedLocation.areaName
  },
  city,
  createdBy: userId
})

    console.log(post)

    return res.status(201).json({
      success:true,
      message: "Complaint posted successfully",
      post
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message: "Server error",
      error: error.message
    })
  }
}


async function getCityPostsController(req, res) {
  try {
    const { city } = req.query

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City query is required"
      })
    }

    // find posts by city & sort newest
    const posts = await postModel
      .find({ city: city })
      .populate("createdBy", "fullName email avatar") // show user basic info
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      totalPosts: posts.length,
      posts
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    })
  }
}



module.exports = { createPostController ,getCityPostsController}
