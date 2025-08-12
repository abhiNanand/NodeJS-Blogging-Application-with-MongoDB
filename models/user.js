const { Schema, model } = require("mongoose");
const {createHmac, randomBytes} = require('crypto'); //its a build in package. create Hmac hash karta hai password ko


const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
  },
  { timestamps: true }
);

//this function will help us to hash user password. 
userSchema.pre('save',function(next){
const user= this;
if(!user.isModified("password"))
  return next();

const salt = randomBytes(16).toString('hex'); //Salt ek random string hoti hai jo password hashing ke process me use hoti hai taaki password ko zyada secure banaya ja sake.
const hashedPassword = createHmac('sha256',salt).update(user.password)
.digest("hex");

 this.salt = salt;
 this.password =  hashedPassword;

 next();
});

//virtaul function
userSchema.static('matchPassword',async function(email,password){
const user = await this.findOne({email});

if(!user)
  throw new Error("User not found!");

const salt = user.salt;
const hashedPassword = user.password;

const userProvidedHash = createHmac('sha256',salt).update(password)
.digest("hex");

if(hashedPassword !== userProvidedHash)
  throw new Error("Incorrect Password");

return {...user,password:undefined,salt:undefined};

});

const User =  model("User",userSchema);

module.exports = User;