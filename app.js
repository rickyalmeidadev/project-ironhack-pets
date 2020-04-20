require('dotenv').config();

// Imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');

// Google Auth
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

// Mongoose connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(response => console.log(`Connected to Mongo! Database name: "${response.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session
app.use(
  session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 * 60 },
    rolling: true,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

// Flash
app.use(flash());

// Passport local strategy
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Email ou senha incorretos, tente novamente',
          });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, {
            message: 'Email ou senha incorretos, tente novamente',
          });
        }
        return done(null, user);
      });
    }
  )
);

// Passport Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log('>>> Detalhes da conta do Google: ', profile);
      console.log('>>> accessToken: ', accessToken);
      console.log('>>> refreshToken: ', refreshToken);

      const { id, displayName, emails } = profile;

      User.findOne({ googleID: id })
        .then(user => {
          console.log('>>> Estou no then do User.findOne, olha a resposta:', user);
          if (user) {
            done(null, user);
            return;
          }

          User.create({ googleID: id, name: displayName, email: emails[0].value, accessToken, refreshToken })
            .then(newUser => {
              console.log('>>> Estou no then do User.create, olha a resposta:', newUser);
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/user', require('./routes/user.routes'));
app.use('/pet', require('./routes/pet.routes'));
app.use('/event', require('./routes/event.routes'));

// Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

module.exports = oAuth2Client;
