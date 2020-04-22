const Pet = require('../models/Pet');
const Event = require('../models/Event');

const { getDateNow } = require('../helpers/getDateNow');

const getUserDashboard = (req, res, next) => {
  const { user } = req;
  const { _id } = user;
  const noPets = 'Você ainda não adicionou um pet';
  const noEvents = 'Sem próximos eventos por enquanto...';

  Pet.find({ owner: _id })
    .then(pets => {
      if (pets.length === 0) {
        const obj = { user, noPets, noEvents };
        res.render('user', { obj });
        return;
      }

      const idsForFilter = pets.map(pet => pet._id);
      const dateForFilter = getDateNow();

      Event.find({ date: { $gt: dateForFilter }, owner: { $in: idsForFilter } })
        .sort({ date: 1 })
        .limit(6)
        .populate('owner')
        .then(events => {
          if (events.length > 0) {
            const obj = { user, pets, events };
            res.render('user', { obj });
            return;
          }

          const obj = { user, pets, noEvents };
          res.render('user', { obj });
        })
        .catch(() => {
          const obj = { user, pets, noEvents };
          res.render('user', { obj });
        });
    })
    .catch(() => {
      const obj = { user, noPets, noEvents };
      res.render('user', { obj });
    });
};

module.exports = userControllers = { getUserDashboard };
