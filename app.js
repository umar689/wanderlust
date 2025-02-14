if(process.env.NODE !="production"){//jb production prr nahi hai tb dotenv ko use kar na hai baaki time nahin
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); 
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");// import passprt
const User = require("./models/user.js");
const LocalStrategy = require('passport-local').Strategy; //import local strategy from passport

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))

const sessionOptions = {
  secret:"mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//This middleware initializes Passport in your application.
//It is used to set up Passport middleware in the Express app to handle login requests and strategies.
app.use(passport.session());// This is needed if your app supports "persistent login sessions," meaning users stay logged in across page reloads.
passport.use(new LocalStrategy(User.authenticate()));//This sets up the local authentication strategy for Passport.
//When it's used: When a user tries to log in, Passport will use this strategy to check the username and password they provide.
passport.serializeUser(User.serializeUser());//serializeUser: Converts the user object (from the database) into an ID (or other unique identifier) and saves it to the session.
//User.serializeUser(): This is a method provided by passport-local-mongoose that simplifies the process of serialization.
//Why serialization is needed: When a user logs in, the user data is stored in the session. Instead of storing the entire user object (which can be large), only the unique ID is stored for efficiency.
passport.deserializeUser(User.deserializeUser());//Purpose: This tells Passport how to deserialize the user data from the session.
//What it does:
//deserializeUser: Retrieves the full user object from the session using the unique ID that was saved during serialization.
//User.deserializeUser(): This is a method provided by passport-local-mongoose that retrieves the user data from the database using the ID stored in the session.
//Why deserialization is needed: When a user makes a new request (after logging in), Passport uses the ID in the session to fetch the full user data. This ensures that you can access the user's details in req.user.

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.get("/demouser",async (req,res) => {
  let fakeUser = new User({
    email : "student@gamil.com",
    username : "delta-student",
  });
  let registeredUser = await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});