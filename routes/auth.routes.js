const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');
const flash = 'connect-flash';

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
    password: hashPass,
  })
    .then(user => {
      console.log(user);
      req.login(user, err => {
        if (err) {
          res.render('index', { message: 'Algo deu errado, tente entrar com seu novo cadastro' });
          return;
        }
        res.redirect('/user');
      })
    })
    .catch(error => {
      console.log('Failed to create user, error: ', error);
      res.render('index', { messageSignUp: 'Falha ao cadastrar-se, tente novamente' });
    });
});

// Login Route
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true,
    passReqToCallback: true,
  })
);

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Social Login

// one way out to google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    accessType: 'offline'
  })
);

// onde back from google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/user',
    failureRedirect: '/', // here you would redirect to the login page using traditional login approach
  })
);

module.exports = router;
