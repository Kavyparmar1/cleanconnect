const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: ["garbage", "drainage", "road", "water", "other"],
    required: true
  },

  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    areaName: {
      type: String,
      required: true
    }
  },

  city: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["open", "in-progress", "cleaned"],
    default: "open"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true })  // automatically adds createdAt & updatedAt


const postModel = mongoose.model("Post", postSchema)

module.exports = postModel
