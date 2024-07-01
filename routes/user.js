const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../Controller/user.js");


router.route("/signup")
.get(userController.rendersignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderloginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)

router.get("/logout",wrapAsync(userController.logout));
module.exports=router;