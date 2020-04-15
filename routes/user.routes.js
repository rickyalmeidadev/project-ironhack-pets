const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Pet = require('../models/Pet');
const ensureLogin = require("connect-ensure-login");

router.get('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const user = req.user;
  const id = req.user._id;

  Pet.find({ owner: id })
    .then(pets => {
      Event.find()
        .sort({ date: 1 })
        .populate('owner')
        .then(events => {
          
          const petsIds = pets.map(pet => JSON.stringify(pet._id));
          events = events.filter(event => {
            return petsIds.includes(JSON.stringify(event.owner._id));
          });
          
          // let dateNow = new Date()
          // let yearNow = dateNow.getFullYear()
          // let monthNow = dateNow.getMonth()
          // let dayNow = dateNow.getDate()

          // events = events.filter(event => {
          //   const YearMonthDay = event.date.split('-')
          //   [year, month, day] = YearMonthDay;
          //   console.log(`
          //     YearNow = ${yearNow}
          //     MonthNow = ${monthNow}
          //     DayNow = ${dayNow}

          //     YearEvent = ${year}
          //     MonthEven = ${month}
          //     DayEvent = ${day}
          //   `) 
          //   if (year > yearNow) return true;
          //   if (year === yearNow && month > monthNow) return true;
          //   if (year === yearNow && month === monthNow && day > dayNow) return true;
          //   return false;
          // })
          
          events = events.slice(0,6)

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
});

module.exports = router;
