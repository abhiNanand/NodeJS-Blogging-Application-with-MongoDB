const express = require('express');
const path = require('path');
const mongoose = require("mongoose");

const userRoute = require("./routes/user");

const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middleware/authentication');

const blog = require("./models/blog");

const app=express();
const PORT = 8000;

app.use(express.static(path.resolve('./public')));  
mongoose.connect('mongodb://localhost:27017/blogApp')
.then(()=>console.log("mongodb connected"))
.catch((error)=>console.log(`error ${error}`));

app.set("view engine","ejs");
app.set("views",path.resolve('./views'));

app.use(express.urlencoded({extended:false})); //Express tumhare HTML form se aane wale data ko parse karega aur req.body me JavaScript object banake de dega.1️⃣ Context — Kab Use Hota Hai
// Jab tum form submit karte ho with method = POST
// Aur form ka Content-Type hota hai application/x-www-form-urlencoded (HTML form ka default type.Without this middleware, Express tumhare req.body ko undefined rakhega.extended: false → Data ko parse karne ke liye Node.js ka built-in querystring module use karega (nested objects support nahi karta).
// extended: true → Data ko parse karne ke liye qs library use karega (nested objects support karta).

app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/",async(req,res)=>{
  const allBlogs = await blog.find({});
  res.render("home",{
    user:req.user,
    blogs: allBlogs,
  });
});

app.use("/user",userRoute);
 

 const blogRoute = require("./routes/blog");
 app.use("/blog",blogRoute);



app.listen(PORT,()=>{
  console.log(`server start at http://localhost:${PORT}`)
});

