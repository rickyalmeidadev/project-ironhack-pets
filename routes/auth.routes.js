const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');
const flash = ('connect-flash')

const User = require('../models/User');

// Email config
// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS
//   }
// });

// Sign Up Route
router.post('/signup', (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (name === '' || email === '' || password === '') {
    res.render('index', { message: 'Por favor, preencha todos os campos' });
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    name,
    email,
    password: hashPass
  })
  .then(user => {
    console.log(user);
    res.render('index');
  })
  .catch(error => {
    console.log('Failed to create user, error: ', error);
    res.render('index');
  });
});


// Login Route
router.post("/login", passport.authenticate("local", {
  successRedirect: '/user',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true,
}));

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/"); 
});

module.exports = router;