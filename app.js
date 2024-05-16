if (process.env.NODE !=="production"){
  require('dotenv').config();
}

console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const Campground = require('./model/campground');
const ejsMate = require('ejs-mate')
var methodOverride = require('method-override'); //to use patch or delete must include
const catchAsync = require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');
const {campgroundSchema, ReviewSchema} = require('./schema.js');
const Review = require('./model/review');
const userRoutes = require('./route/user');
const campgroundsRoutes = require('./route/campground');
const reviewsRoutes = require('./route/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user');

app.use(express.static(path.join(__dirname, 'public')));// to use bootstrap
app.set('view engine','ejs'); 
app.set('views', path.join(__dirname, '/views')); 
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)



const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})
const sessionConfig = {
  secret : 'thisshouldbeabettersecret',
  resave: false, 
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //store user into the session
passport.deserializeUser(User.deserializeUser()); //get user out of the session

app.use((req,res,next)=>{
  //console.log(req.session) 
  res.locals.currentUser = req.user
  res.locals.success =req.flash('success')
  res.locals.error =req.flash('error')
  next()
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);

app.get('/fakeUser',async(req,res)=>{
  const user = new User({email:'colt123@gmail.com', username:'colt99'});
  const newUser = await User.register(user, 'chicken');
  res.send(newUser);
})


app.get('/', (req, res) => {
  res.render('home')
})


//for all the request that does not all response
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no , something went wrong'
    res.status(statusCode).render('error', {err});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})