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
      if (pets.length === 0) {
        const obj = { 
          user,
          noPets: 'Você ainda não adicionou um pet',
          noEvents: 'Sem próximos eventos por enquanto...'
        }
        res.render('user', { obj })
        return
      }

      Event.find()
        .sort({ date: 1 })
        .populate('owner')
        .then(events => {
          const petsIds = pets.map(pet => JSON.stringify(pet._id));
          events = events.filter(event => {
            return petsIds.includes(JSON.stringify(event.owner._id));
          });
          
          let dateNow = new Date()
          let yearNow = dateNow.getFullYear()
          let monthNow = dateNow.getMonth()
          let dayNow = dateNow.getDate()
      
          events = events.filter(event => {
            const YearMonthDay = event.date.split('-')
            const [year, month, day] = YearMonthDay;

            if (Number(year) > yearNow) return true;
            if (Number(year) === yearNow && Number(month) > monthNow) return true;
            if (Number(year) === yearNow && Number(month) === monthNow && Number(day) > dayNow) return true;
            return false;
          });

          if (events.length > 0) {
            events = events.slice(0,6)
  
            const obj = {
              user,
              pets,
              events,
            };
            res.render('user', { obj });
          } else {
            const obj = {
              user,
              pets,
              noEvents: 'Sem próximos eventos por enquanto...'
            };
            res.render('user', { obj });
          }

        })
        .catch(() => {
          const obj = {
            user,
            pets,
            noEvents: 'Sem próximos eventos...'
          };
          res.render('user', { obj });
        });
    })
    .catch(error => {
      console.log('>>> Estou aqui no catch dos pets <<<');
      const obj = { 
        user,
        noPets: 'Você ainda não adicionou um pet' 
      }
      res.render('user', { obj })
    });
});

module.exports = router;
