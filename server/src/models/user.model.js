const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName:{
    firstName:{ 
      type:String,
      required:true,
      trim:true
    },
    lastName:{
      type:String,
      required:true,
      trim:true
    }
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  password:{
    type:String,
    required:true,
    select:false
  },
  city:{
    type:String,
    required:true,
    index:true
  },
  avatar:{
    type:String
  },
  role:{
    type:String,
    enum:['user','authority','admin'],
    default:'user'
  },
  points:{
    type:Number,
    default:0
  }
},{
  timestamps:true
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel
