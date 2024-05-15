const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Review = require('../model/review')
const Campground = require('../model/campground');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/review');

router.post('/',isLoggedIn,validateReview, catchAsync(reviews.editReviews))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReviews))


module.exports = router;