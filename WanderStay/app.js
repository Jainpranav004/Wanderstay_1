const express = require ("express")
const app = express()
const mongoose = require("mongoose")
const path = require ("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require ("./utils/ExpressError.js")

const session = require("express-session")
const flash = require("connect-flash")

//PASSPORT REQUIRING
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/userModel.js")

//Requiring express-sessions from routes dir
const userRouter = require("./routes/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

//Mongoose setup - This save and reloads data from db (index.js)

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("Connected to db")
})
.catch((err)=>{
    console.log(err)
})
 async function main(){
    await mongoose.connect(mongo_url);
}



app.set("view engine","ejs")
app.set("views",path.join(__dirname, "views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)   //FOR EJS MATE IMPORT
//FOR USING STATIC FILES 
app.use(express.static(path.join(__dirname,"public")));


//USING EXPRESS-SESSIONS
const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        maxAge : 1000*60*60*24*3 , //3 days in milli seconds
        expires: Date.now() + 1000*60*60*24*3 
    }
}
app.use(session(sessionOptions));
app.use(flash());


//USING PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (User.authenticate())),

passport.serializeUser(User.serializeUser()),
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser" ,async (req,res) => {
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username : "delta-username",
//     })
//     let registeredUser = await User.register(fakeUser,"Mypassword");
//     res.send(registeredUser)
// })


app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    next();
})


//USING EXPRESS SESSION FOR LISTINGS
app.use("/listings", listings)

//USING EXPRESS SESSION FOR REVIEWS
app.use("/listings/:id/reviews", reviews)

//USING EXPRESS-SESSION ROOUTES
app.use("/" , userRouter )



//Error handling for ,if any unkown and undefind route is excessed then this will throw an error
app.all("*" ,(req,res,next) => {
    next(new ExpressError (404,"Page not found"))
})


//MIDDLEWARE for handling client side validation error   (BY THIS SERVER DONTSTOP EVEN AFTER ERROR)
// app.use((err,req,res,next) => { 
//     res.status(500).render('error' ,{ err:error}); // Pass the err object as a variable
//     // res.status(statusCode).send(message);
//     res.render("error.ejs");
// });


app.get("/",(req,res) => {
    res.send("Hi,I am root page")
});

app.listen(3000,() => {
    console.log("server is working to port 3000")
})
