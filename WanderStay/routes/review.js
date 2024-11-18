const express = require ("express")
const router = express.Router({ mergeParams: true});    //mergeparams : for using parameters of parent in child i.e; listinng's params in review
const wrapAsync =require ("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const ExpressError = require ("../utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("../joiSchema.js")  //JOI FOR SCHEMA VALIDATION
const Review = require("../models/reviews.js")



const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
};



//POST REQUEST
router.post("/" , validateReview , wrapAsync (async(req,res)=> {
    let listing = await Listing.findById(req.params.id);
//HERE WE WILL GET THE THE REVIEW DATA FROM FORM BACKEND
    let newReview = new Review (req.body.review);

    listing.reviews.push(newReview);  //listinng ke review array ko access krke db me push krega
    
    await newReview.save();
    await listing.save();
    //Creating flash
    req.flash("success","New review created successfully"); 
    res.redirect(`/listings/${listing._id}`)
   }))

//DELETE REVIEW REQUEST 
router.delete("/:reviewId" , wrapAsync(async(req,res) => {
   let {id ,reviewId} = req.params;
   //used trim as error was coming due to some space in id
   const trimId =  id.trim();

   //PULL OPERATOR: PULLS A VALUE FROM ANY COLECTION BY ITS ID
   await Listing.findByIdAndUpdate(trimId , {$pull :{reviews : reviewId}});
   await Review.findByIdAndDelete(reviewId);
   //Creating flash
   req.flash("success","Review deleted successfully"); 

   res.redirect(`/listings/${trimId}`);
   })
);


module.exports = router;