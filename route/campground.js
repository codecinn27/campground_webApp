const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const Campground = require('../model/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campground');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createNewCampground))


router.get('/new',isLoggedIn, campgrounds.renderIndexNew)

router.route('/:id')
    .get(catchAsync(campgrounds.renderIdCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.editCampgrounds))
    .delete(isLoggedIn,catchAsync(campgrounds.deleteCampgrounds))

router.get('/:id/edit', isLoggedIn, isAuthor,catchAsync(campgrounds.renderEditCampgrounds))

module.exports = router;