const mongoose = require('mongoose')

const connectRequestSchema = new mongoose.Schema({ 
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:true
    },
    fromUser: { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
      }
},{ 
    timestamps:true
})

// Prevent duplicate requests
connectRequestSchema.index({ postId: 1, fromUser: 1 }, { unique: true })

const connectRequestModel = mongoose.model("ConnectRequest", connectRequestSchema)

module.exports = connectRequestModel