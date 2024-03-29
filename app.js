//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require('bcrypt');
const encrypt = require("mongoose-encryption")
const saltRounds = 10;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema( {
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
  res.render("home")
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser =new User({
      email:req.body.username,
      password: hash
    })
    newUser.save((err)=>{
      if(err){
        console.log(err);
      }else{
        res.render("secrets")
      }
    })
});

});

app.post("/login",(req,res)=>{
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email},(err, foundUser)=>{
    if(err){
      console.log(err);
    }else{

      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result) {
          res.render("secrets");
        }
        });

      }
    }
  })
})

app.listen(3000,()=>{
  console.log("servido en el port 3000");
})
