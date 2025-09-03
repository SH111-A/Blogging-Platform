const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      done(null, existingUser);
    } else {
      const newUser = new User({
        username: profile.displayName,
        googleId: profile.id,
        email: profile.emails[0].value,
        // password can remain empty or random since they use Google login
      });
      await newUser.save();
      done(null, newUser);
    }
  } catch (err) {
    done(err, null);
  }
}));
