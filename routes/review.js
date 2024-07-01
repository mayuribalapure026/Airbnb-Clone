const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../Controller/review.js");


//Review CREATE Route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//Review Delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
module.exports=router;