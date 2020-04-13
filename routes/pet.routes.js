const express = require('express');
const router = express.Router();

const Pet = require('../models/Pet');

router.get('/', (req, res, next) => {
  const isLogged = req.user;

  

  res.render('pet', { isLogged });
  return;
});

module.exports = router;