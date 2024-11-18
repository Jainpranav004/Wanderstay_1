//EXPRESS- SESSIONS

const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")


app.set("view engine","ejs")
app.set("views",path.join(__dirname, "../ views"))


// app.use(session(sessionOptions));/

app.use(session({ 
    secret : "mysupersecretstring",
    resave: false ,
    saveUninitialized :  true,
}));  //genrates session id for routes


//USING CONNECT-FLASH MIDDLEWARE 
app.use(flash());


//FRO COUNTING NUMBER OF REQUESTS
app.use("/reqcount" ,(req,res) => {
    if (req.session.count ) {
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(  `You Refreshed (sent request ) ${req.session.count} times `)
})


//ACTUAL USE OF SESSIONS
app.get("/register" ,(req,res) => {
    let {name ="anonymns"} = req.query ;
    req.session.name = name;
    req.flash("successKey" , "User is Registerd successfully")
    res.redirect("/hello")
})
        //HERE THIS NAME IS STORED AS COOKIE AND USED ON SEPERATE PAGE
app.get("/hello", (req,res) => {
    res.render("flash.ejs",{name: req.session.name , msg : req.flash("successKey") });
})     



app.use("/test" ,(req,res) => {
    res.send("test successful")
})
app.use("/test2" ,(req,res) => {
    res.send("test2 successful")
})
app.listen(3000, () => {
    console.log("Server is listening to 3000");
}) 