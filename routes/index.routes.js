const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.user) {
    const isLogged = req.user;
    res.render('index', { isLogged });
    return;
  }
  res.render('index');
});

module.exports = router;
