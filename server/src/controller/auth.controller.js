const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
async function registerController(req,res){ 
   try {
    const { fullName:{ firstName, lastName }, email, password, city, avatar } = req.body


    const userAlreadyExist = await userModel.findOne({ email })
    if (userAlreadyExist) {
      return res.status(400).json({ message: "Email already exists" })
    }
    const hashpass =await bcrypt.hash(password,10)
    
    const user = await userModel.create({
        fullName:{ firstName, lastName },
        email,
        password: hashpass,
        city,
        avatar,
        role: 'user',     // 🔒 controlled by backend
        points: 0         // 🔒 controlled by backend
      })
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SEC_KEY,
        { expiresIn: '7d' }
      )
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
  
      return res.status(201).json({
        message: "User registered successfully"
      })

   } catch (error) {
    return res.status(500).json({
        message: "Internal server error",
        error:error.message
      })
    }
   }
async function loginController(req,res){ 
  try {
    const {email,password} = req.body
  const isUserExist = await userModel.findOne({email}).select("+password")
  console.log(isUserExist);
  if(!isUserExist){
     return res.status(400).json({
       message:'Email can not registered'
     })
  } 
     const isPassvalid = await bcrypt.compare(password,isUserExist.password)
     
     
     if(!isPassvalid){
      return res.status(400).json({
        message:"password doesn't valid"
      })
     }
     const token = jwt.sign(
      { id: isUserExist._id },
      process.env.JWT_SEC_KEY,
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return res.status(201).json({
      message:"user login succesfully",
      isUserExist
      
    })

  }
 catch (error) {
  console.log(error)
 
    return res.status(500).json({
      message: "Internal server error",
      error:error.message,
      
      
    })
  }
}
async function getMe(req,res){
    try {
      const user = req.user 
      return res.status(200).json({
         message:"user profile fetched",
         user
      })
    } catch (error) {
      return res.status(400).json({
        message:"Internal server error",
        error:error.message
      })
    }
    
}
module.exports = {
     registerController,
     loginController,
     getMe
}