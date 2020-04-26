const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');

const User = require('./models/user');

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    // find a user specified in token, if user doesnt exist handle it otherwise return the user
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }

    return done(null, user);

  } catch (error) {
    return done(error, false);
  }
}));

passport.use(new LocalStrategy({

}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return done(null, false);
    }

    const match = await user.isValidPassword(password);

    if (!match) {
      return done(null, false);
    }

    done(null, user);

  } catch (error) {
    done(error, false);
  }
}));