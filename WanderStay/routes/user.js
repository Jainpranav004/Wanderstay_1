const express= require ("express");
const router = express.Router();
const User = require("../models/userModel");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;


router.get("/signup" , (req,res) => {
     res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync( async(req,res) => {

    try{
        let {username , email, password} = req.body;   
        const newUser = new User ( {username, email});
        const registerdUser = await User.register(newUser , password);
        console.log(registerdUser);
        req.flash("success" , "Welcome to WanderLust!");
        res.redirect("/listings");
    }catch(e) {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}));

router.get("/login" ,(req,res) => {
    res.render("users/login.ejs")
})

//Passport authentication
router.post("/login" , 
    passport.authenticate('local', 
    {failureRedirect : '/login' , 
    failureFlash : true} ) ,
    async (req,res) => {
        req.flash("success", "Welcome Back to WanderLust!") ;
        res.redirect("/listings");

});

module.exports = router;