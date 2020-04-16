const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  req.flash
  if (req.user) {
    const obj = { user: req.user }
    res.render('index', { obj });
    return;
  }
  res.render('index', { message: req.flash('error') });
});

module.exports = router;
