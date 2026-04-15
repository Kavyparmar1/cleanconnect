const mongoose = require('mongoose')

const groupSchema =new mongoose.Schema({ 
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        unique:true,
        required:true
    },
    members:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    isActive:{
        type:boolean,
        deafult:true
    }
},{timestamps:true})

const groupModel = mongoose.model("Group",groupSchema)

module.exports = groupModel