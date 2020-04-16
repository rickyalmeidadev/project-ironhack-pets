const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Pet = require('../models/Pet');
const ensureLogin = require("connect-ensure-login");
const uploadCloud = require('../config/cloudinary.js')

// pet details
router.get('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  

  Pet.findById(id)
  .populate('owner')
  .then(pet => {
    Event.find({owner:id})
    .sort({date: 1})
    .then(events => {
      const obj = {
        pet,
        user,
        events
      }
      res.render('pet', {obj})
    })
    .catch(() => {
      const obj = {
        pet,
        user
      }
      res.render('pet', {obj})
    })
  })
  .catch(error => {
    console.log('Falha ao acessar página do pet: ', error)
    res.redirect('/user')
  });
});

// pet add
router.post('/add', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { name, species, birthdate } = req.body;
  const id = req.user._id;
  if (req.file) {
    Pet.create({
      name,
      species,
      birthdate,
      owner: id,
      path: req.file.url,
      originalName: req.file.originalname
    })
    .then(pet => {
      console.log('Pet criado com sucesso', pet);
      res.redirect('/user');
    })
    .catch(error => console.log('Falha ao criar pet: ', error));
  } else {
    Pet.create({
      name,
      species,
      birthdate,
      owner: id,
    })
    .then(pet => {
      console.log('Pet criado com sucesso', pet);
      res.redirect('/user');
    })
    .catch(error => console.log('Falha ao criar pet: ', error));
  }
});

// pet edit photo
router.post('/edit/photo/:id', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const id = req.params.id;
  Pet.findByIdAndUpdate(id, {
    path: req.file.url,
    originalName: req.file.originalname
  },
  { 
    new: true 
  })
  .then(pet => {
  console.log(`${pet} foto atualizada!!!`);
  res.redirect('/pet/'+ id)
  })
  .catch(error => console.log('Falha ao atualizar foto do pet: ', error));
})

// pet edit
router.post('/edit/:id', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const {name, species, birthdate} = req.body;
  const id = req.params.id;
  if (req.file) {
    Pet.findByIdAndUpdate(id, {
      name, 
      species, 
      birthdate,
      path: req.file.url,
      originalName: req.file.originalname
    },
    { 
      new: true 
    })
    .then(pet => {
    console.log(`${pet} atualizado!!!`);
    res.redirect('/pet/'+ id)
    })
    .catch(error => console.log('Falha ao atualizar pet 1: ', error));
  } else {
    Pet.findByIdAndUpdate(id, {name, species, birthdate},{new:true})
    .then(pet => {
      console.log(`${pet} atualizado!!!`);
      res.redirect('/pet/'+ id)
    })
    .catch(error => console.log('Falha ao atualizar pet 2: ', error));
  }
})

// pet delete
router.get('/delete/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const id = req.params.id;
  // delete related events
  // code here
  Event.deleteMany({ owner: id })
  .then(events => {
    console.log(`${events} deletados!!!`);
    Pet.findByIdAndDelete(id)
    .then(pet => {
      console.log(`${pet} deletado!!!`);
      res.redirect('/user')
    })
    .catch(error => console.log('Falha ao deletar pet ', error));
  })
  .catch(error => console.log('Falha ao deletar eventos ', error));
})

module.exports = router;
