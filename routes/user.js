const {Router} = require("express");
const User = require('../models/user');
const router = Router();

router.get('/signin',(req,res)=>{
  return res.render("signin");
});

router.get("/signup",(req,res)=>{
  return res.render("signup");
});

router.post("/signup",async(req,res)=>{
const {
  fullName,
  email,
  password
} = req.body;

if (!password) {
    return res.status(400).send("Password missing in form data");
  }
  try{
  await User.create({ fullName, email, password });
  return res.redirect("/");
  }
catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      error: "Signup failed. Try again with a different email.",
    })}
});

router.post("/signin",async(req,res)=>{
  const {email,password} = req.body;
  try{
  const token = await User.matchPasswordAndGenerateToken(email,password);
  console.log("token",token);
  // ✅ Set cookie with token
    res.cookie("token", token, { httpOnly: true });
  return res.redirect("/");
  }
  catch(error){
    return res.render("signin",{
      error:"Incorrect Email or Password",
    });
  }
 

});

router.get('/logout',(req,res)=>{
  res.clearCookie('token').redirect('/');
});


module.exports = router;