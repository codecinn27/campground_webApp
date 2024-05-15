const User = require('../model/user');

module.exports.renderRegister =  (req,res)=>{
    res.render('users/register')
}

module.exports.registerUser = async(req,res,next)=>{
    try{
        const {email, username, password} = req.body;

        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            req.flash('error', 'Username is already taken. Please choose a different one.');
            return res.redirect('/register');
        }
        const user = new User({email, username});
        const registerUser = User.register(user,password);
        req.login(registerUser, err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
        req.flash('success','Welcome to Yelp Camp');
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }

}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req,res)=>{
    req.flash('success','Welcome back !!!')
    // below code, either return to the page you just visit or redirect you automatically to the /campgrounds
    const redirectUrl = res.locals.returnTo || '/campgrounds';  // update this line to use res.locals.returnTo now
    console.log(redirectUrl)
    delete req.session.returnTo; // use to delete the residue (original url) left in the session 
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    });
}