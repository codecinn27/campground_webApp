const ExpressError = require('./utility/ExpressError');
const {campgroundSchema} = require('./schema.js');
const Campground = require('./model/campground');
const {ReviewSchema} = require('./schema.js');
const Review = require('./model/review');

module.exports.validateReview = (req,res,next)=>{
    const {error} = ReviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(',') //make it a single string message
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
    
}

module.exports.isLoggedIn = (req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'you must be signed in first!!');
        return res.redirect('/login');
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{

    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(',') //make it a single string message
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor= async(req,res,next)=>{
    const{id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

module.exports.isReviewAuthor= async(req,res,next)=>{
    const{id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}