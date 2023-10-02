const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user/User");
const { comparePassword } = require("../services/auth");

module.exports = function (app) {
  // Initialize Passport and session middleware
  app.use(passport.initialize());
  app.use(passport.session()); //important because deserializeUser has to decode the information from the session id

  // Configure the LocalStrategy for authenticating users
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      // Replace this with your own authentication logic
      async function (email, password, done) {
        // Example code to authenticate the user
        User.findOne({ where: { email } }, function (err, user) {
          if (err) return done(err);
          if (!user || comparePassword(password, user.password))
            return done(null, false);
          return done(null, user);
        });
      }
    )
  );

  // Configure Passport to serialize and deserialize users
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      if (err) return done(err, null);
      done(null, user);
      // done(err, user);
    });
  });
};
