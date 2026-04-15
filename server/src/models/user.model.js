const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName:{
    firstName:{ 
      type:     String,
      required: true,
      trim:     true,
      maxlength: 50,
    },
    lastName:{
      type:    String,
        trim:    true,
        default: "",
    }
  },
  email:{
    type:     String,
      required: true,
      unique:   true,      // ← creates a unique index automatically
      index:    true,      // ← ensures fast lookups on every query
      trim:     true,
      lowercase: true,     // ← always stored lowercase in DB
      maxlength: 254,
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
    default:0,
    min:0
  }
},{
  timestamps:true
})
// Compound index example — useful for admin queries
userSchema.index({ role: 1, createdAt: -1 });
const userModel = mongoose.model('User', userSchema)

userSchema.index({ city: 1, createdAt: -1 })
module.exports = userModel
