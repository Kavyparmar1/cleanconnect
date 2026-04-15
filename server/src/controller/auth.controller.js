const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

//config
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
const JWT_SECRET    = process.env.JWT_SEC_KEY;
const JWT_EXPIRES   = process.env.JWT_EXPIRES || "7d";


async function registerController(req,res){ 
   try {
    const { fullName, email, password, city, avatar } = req.body
   // req.body is already validated by Zod middleware (auth.validator.js)
  const normalizedEmail = email.toLowerCase().trim()
  const hashedPassword = await bcrypt.hash(password,BCRYPT_ROUNDS)
    const user = await userModel.create({
      fullName: {
        firstName: fullName.firstName,
        lastName: fullName.lastName || "",
      },
      email:normalizedEmail,
      password: hashedPassword,
      city,
      avatar,
      role: "user",   // controlled
      points: 0,
    });
      const token = jwt.sign(
        { id: user._id},
       JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      )
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
  
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
      });
  

   } catch (error) {
     // MongoDB duplicate key — safety net if unique index fires
     if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }
    console.error("[registerController]", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
   }
async function loginController(req,res){ 
  try {
    const {email,password} = req.body
    const normalizedEmail = email.toLowerCase().trim()
  const user = await userModel.findOne({email:normalizedEmail}).select("+password")
 
  if(!user){
     return res.status(400).json({
      success:false,
       message:'Invalid email or password'
     })
  } 
     const isPassvalid = await bcrypt.compare(password,user.password)
     
     
     if(!isPassvalid){
      return res.status(400).json({
        message:"Invalid email or password"
      })
     }
     const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SEC_KEY,
      { expiresIn: '7d' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      
    })

  }
 catch (error) {
  
  console.error("[loginController]", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
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