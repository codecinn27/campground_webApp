const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique:true
    }
});

UserSchema.plugin(passportLocalMongoose); // automatically add username and password to your schema
//any question can go to documention of passport-local-mongoose npm

module.exports = mongoose.model('User', UserSchema);