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

  await User.create({ fullName, email, password });
  return res.redirect("/");
});


module.exports = router;