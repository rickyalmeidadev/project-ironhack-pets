const express = require('express');
const router = express.Router();

const Pet = require('../models/Pet');

router.get('/', (req, res, next) => {
  if (req.user) {
    const user = req.user;
    const id = req.user._id

    Pet.find({ owner: id })
    .then(pets => {
      // res.send(pets)
      const obj = {
        user,
        pets
      }
      res.render('user', { obj });
    })
    .catch(error => res.render('user', { user }))
  }
});

module.exports = router;
