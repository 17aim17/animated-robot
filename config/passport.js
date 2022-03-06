const GoogleStrategy = require('passport-google-oauth20').Strategy

const mongoose = require('mongoose');
const User = require('../models/User')


module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);

        const newUser = {
            googleID: profile._json.sub,
            email: profile._json.email,
            firstName: profile._json.given_name,
            lastName: profile._json.family_name,
            image: profile._json.picture,
            accessToken: accessToken
        }

        User.findOne({
            googleID: newUser.googleID
        }).then((user) => {
            if (user) done(null, user)
            else {
                new User(newUser).save().then(user => {
                    done(null, user)
                })
            }
        })

    })

    );
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user))
    });

}