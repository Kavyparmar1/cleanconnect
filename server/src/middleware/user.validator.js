const z = require('zod')


const registerSchema = z.object({
    fullName: z.object({
        firstName: z
          .string()
          .min(2, "First name must be at least 2 chars")
          .max(50, "First name too long")
          .trim(),
        lastName: z
          .string()
          .max(50, "Last name too long")
          .trim()
          .optional()
          .default(""),
      }),
    
      email: z
        .string()
        .email("Invalid email format")
        .max(254, "Email too long")       // RFC 5321 max
        .toLowerCase()                    // normalize right here
        .trim(),
    
      password: z
        .string()
        .min(8,  "Password must be at least 8 characters")
        .max(128, "Password too long")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain uppercase, lowercase, and a number"
        ),
    
      city: z.string().max(100).trim(),
      avatar: z.string().url("Invalid avatar URL").optional(),
})
const loginSchema = z.object({
  email: z
  .string()
  .email("Invalid email format")
  .max(254, "Email too long")       // RFC 5321 max
  .toLowerCase()                    // normalize right here
  .trim(),

password: z
  .string()
  .min(8,  "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain uppercase, lowercase, and a number"
  ),

})
// Middleware: validates req.body against schema
function validateRegister(req,res,next){
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
        const errors = result.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return res.status(400).json({ success: false, errors });
      }
    
      req.body = result.data; // use the normalized/coerced data
      next();
}
function validateLogin(req,res,next){
  const result = loginSchema.safeParse(req.body)
  if(!result.success){
    const errors = result.error.issues.map((e)=>({
      field:e.path.join("."),
      message:e.message,
    }))
    return res.status(400).json({ success: false, errors });
  }
  req.body = result.data; // use the normalized/coerced data
  next();
}


module.exports ={ validateRegister,validateLogin}