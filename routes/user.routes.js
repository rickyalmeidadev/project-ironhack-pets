const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Pet = require('../models/Pet');

router.get('/', (req, res, next) => {
  if (req.user) {
    const user = req.user;
    const id = req.user._id;

    Pet.find({ owner: id })
      .then(pets => {
        Event.find()
          .populate('owner')
          .then(events => {
            const petsIds = pets.map(pet => JSON.stringify(pet._id));
            events = events.filter(event => {
              return petsIds.includes(JSON.stringify(event.owner._id));
            });

            console.log(events);
            const obj = {
              user,
              pets,
              events,
            };
            res.render('user', { obj });
          })
          .catch(() => {
            const obj = {
              user,
              pets,
            };
            res.render('user', { obj });
          });
      })
      .catch(error => res.render('user', { user }));
  }
});

module.exports = router;
