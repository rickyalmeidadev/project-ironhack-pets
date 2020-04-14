const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.user) {
    const obj = { user: req.user }
    res.render('index', { obj });
    return;
  }
  res.render('index');
});

module.exports = router;
