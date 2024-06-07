const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.SELF_URL}/auth/google/callback`,
    passReqToCallBack: true
},

    function (request, accessToken, refreshToken, profile, done) {
        done(null, profile)
    }
));