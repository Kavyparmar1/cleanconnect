const postModel = require("../models/post.model")

async function createPostController(req, res) {
  try {
    const { imageUrl, description, category, location, city } = req.body

    const userId = req.user._id   // from protect middleware

    // validation
    if (!imageUrl || !description || !category || !location || !city) {
      return res.status(400).json({
        success:false,
        message: "All fields required"
      })
    }

    if (!location.lat || !location.lng || !location.areaName) {
      return res.status(400).json({
        success:false,
        message: "Location must include lat, lng & areaName"
      })
    }

    // create post
    const post = await postModel.create({
      imageUrl,
      description,
      category,
      location: {
        lat: location.lat,
        lng: location.lng,
        areaName: location.areaName
      },
      city,
      createdBy: userId
    })

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
