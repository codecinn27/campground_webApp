const Review = require('../model/review')
const Campground = require('../model/campground');

module.exports.editReviews = async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new reviews !!!')
    res.redirect(`/campgrounds/${campground._id}`);
 
}

module.exports.deleteReviews = async(req,res)=>{
    const {id, reviewId} = req.params; //destructure it so that you can called it easily
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});//$pull , pull out anything that pass in from the array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}