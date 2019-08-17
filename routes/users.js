const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

// load user model
require('../model/user')
const User = mongoose.model('users')



//User Login
router.get('/login', (req, res) => {
  res.render('users/login')
})



//User Register
router.get('/register', (req, res) => {
  res.render('users/register')
})

// Login form post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ msg: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already exists')
          res.redirect('/users/register')
        } else {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered')
                  res.redirect('/users/login')
                })
                .catch(err => console.log(err));
            })
          })
        }
      })


  }

});

//Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
})


module.exports = router