const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require('passport');

const User = require('../models/User');

const postSignUp = (req, res, next) => {
  const { name, email, password } = req.body;

  if (name === '' || email === '' || password === '') {
    res.render('index', { message: 'Por favor, preencha todos os campos' });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    name,
    email,
    password: hashPass,
  })
    .then(user => {
      req.login(user, err => {
        if (err) {
          res.render('index', { message: 'Algo deu errado, tente entrar com seu novo cadastro' });
          return;
        }
        res.redirect('/user');
      });
    })
    .catch(() => {
      res.render('index', { messageSignUp: 'Falha ao cadastrar-se, tente novamente' });
    });
};

const postLogin = passport.authenticate('local', {
  successRedirect: '/user',
  failureRedirect: '/',
  failureFlash: true,
  passReqToCallback: true,
});

const getLogout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const getGoogle = passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  accessType: 'offline',
});

const getGoogleCallback = passport.authenticate('google', {
  successRedirect: '/user',
  failureRedirect: '/',
});

module.exports = authController = {
  postSignUp,
  postLogin,
  getLogout,
  getGoogle,
  getGoogleCallback,
};
