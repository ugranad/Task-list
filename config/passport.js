const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user-model
const User = mongoose.model('users');


module.exports = function (passport) {
  passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Match User
    User.findOne({
      email: email
    })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Incorrect Password' })
          }
        })

      })
  }))

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

}