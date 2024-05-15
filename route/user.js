const express = require('express');
const router = express.Router();
const catchAsync = require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');

const passport = require('passport');
const {storeReturnTo} = require('../middleware')
const users = require("../controllers/user")

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser ));

router.route('/login')
    .get(users.renderLogin)

//just memorise this line of code, will authomatically handle the error , predefine in passport
// passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'})
// use the storeReturnTo middleware to save the returnTo value from session to res.locals
// passport.authenticate logs the user in and clears req.session
// Now we can use res.locals.returnTo to redirect the user after 
    .post(storeReturnTo, passport.authenticate('local',{failureFlash :true, failureRedirect:'/login'}), users.loginUser);


router.get('/logout', users.logoutUser ); 

module.exports = router;