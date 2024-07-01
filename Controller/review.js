const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async(req,res)=>{
    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    
    await listing.save();
    req.flash("success","New Review Created");
    console.log("New Review Saved");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    let result=await Review.findByIdAndDelete(reviewId);
    console.log(result);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}