const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function protectMiddleware(req, res, next) {
  try {
    const token = req.cookies.token

 
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token"
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC_KEY)


    const user = await userModel.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      })
    }

    
    req.user = user


    next()

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message
    })
  }
}

module.exports = {
  protectMiddleware
}
