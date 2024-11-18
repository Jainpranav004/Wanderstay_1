const express = require ("express")
const router = express.Router();
const wrapAsync =require ("../utils/wrapAsync.js")
const {listingSchema} = require("../joiSchema.js")  //JOI FOR SCHEMA VALIDATION
const ExpressError = require ("../utils/ExpressError.js")
const flash = require("connect-flash")
const Listing = require("../models/listing.js")

//MULTER
const multer = require("multer")
const upload = multer ({dest:'uploads/'})

//MVC FRAMEWORK
const listing_controller = require("../controller/listing_controller.js")


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
};

//INDEX ROUTE
router.get("/", wrapAsync (listing_controller.index) )
 //NEW ROUTE
 router.get("/new",(req,res) => {  
     // if(!req.isAuthenticated()){
     //     req.flash("error" , "you must be logged in to create listing");
     //     return res.redirect("/listings");
     // }
     res.render("listings/new.ejs")
 })
 
 //READ ROUTE
 router.get("/:id" , wrapAsync (async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");  //populate function : renders whole data associated with any object id from the db
     res.render("listings/show.ejs", {listing})
 }))
 
 //CREATE ROUTE
 //This next and err is for client side validation
 router.post("/",validateListing, wrapAsync(  async(req,res,next) => {
 if (!req.body.listing) {
     throw new ExpressError(400 ,"Send valid data for listing")
 }
     let {title,description,image,price,country,location }= req.body;
     const newListing = new Listing(req.body);
     //FOR SCHEMA VALIDATIONS
 
     // if (!newListing.title) {
     //     throw new ExpressError(400,"Title is missing")};
     // if (!newListing.location) {
     //     throw new ExpressError(400,"Location is missing")};
     // if (!newListing.description) {
     //     throw new ExpressError(400,"Description is missing")};    
 
     //USING JOI FOR SCHEMA VALIDATION
     let result = listingSchema.validate(req.body);
     console.log(result)
      if(result.error) {
         throw new ExpressError(400,result.error);
      }
      await newListing.save();
 
      //Creating flash
      req.flash("success","Listing created successfully");     
      res.redirect("/listings") 
      
 }))
 
 
 //EDIT ROUTE
 router.get("/:id/edit", wrapAsync(async(req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id);
 
     //Editing flash
     req.flash("success","Listing edited successfully");
     res.render("listings/edit.ejs",{listing});
 }))
 
 //UPPDATE Route
 router.put("/:id" ,wrapAsync( async(req,res)=>{
     let {id} = req.params;
     try{
         await Listing.findByIdAndUpdate(id, {...req.body}); 
            //Updating flash
            req.flash("success","Listing updated successfully"); 
            res.redirect(`/listings/${id}`)}
     catch(err){
         console.log(err);
          //Updating flash
            req.flash("success","Listing updated successfully"); 
            res.redirect(`/listings/${id}`)
     }
     //... => deconstructs the all data of object into individuals ,and req.body brings the data entered
     // console.log(req.body)
 
    
 }));
 
 //DELETE ROUTE
 router.delete("/:id" ,wrapAsync( async(req,res) => {
     let { id } = req.params;
     try {
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
      } catch (err) {
        console.log(err);
        req.flash("error", "Error deleting listing");
        res.redirect(`/listings/${id}`);
      }
    }));
 
//UPLOADING IMAGES'
router.post(upload.single("listing.image") , (req,res) => {
    res.send(req.file)
})

 module.exports = router;