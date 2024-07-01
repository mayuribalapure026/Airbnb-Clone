if(process.env.NODE_ENV!="production"){
  require('dotenv').config() 
}
console.log(process.env.SECRET);
const express=require("express");
const app=express();
const port=3000;
const path=require("path");
const methodOverride=require("method-override");
const mongoose = require('mongoose');
const ejsMate=require("ejs-mate");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const {isLoggedIn}=require("./middleware.js");

const db_url=process.env.ATLASDB_URL;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}
const store=MongoStore.create({
  mongoUrl:db_url,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("ERROR-IN MONGO SESSION STORE",err);
})
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}

app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();

})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/demoUsers",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"Aman"
//   })
//   let registeredUser=await User.register(fakeUser,"Hello world");
//   res.send(registeredUser);
// })


app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong"}=err;
    res.status(status).render("error.ejs",{err});
})
app.listen(port,()=>{
    console.log(`App listening on port number:${port}`);
})