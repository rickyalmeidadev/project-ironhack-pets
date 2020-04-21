const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Pet = require('../models/Pet');
const ensureLogin = require("connect-ensure-login");
const uploadCloud = require('../config/cloudinary.js')

// pet filter
router.get('/filter/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  let { eventRange, eventType } = req.query;
  

  let dateNow = new Date()
  let yearNow = dateNow.getFullYear()
  let monthNow = dateNow.getMonth()
  let dayNow = dateNow.getDate()

  if (monthNow < 10) monthNow = `0${monthNow}`
  if (dayNow < 10) dayNow = `0${dayNow}`
  const dateForFilter = `${yearNow}-${monthNow}-${dayNow}`

  let query = {};

  if (eventRange === 'filterDate' && eventType !== 'all') {
    query = {
      date: { $gt: dateForFilter },
      type: eventType,
      owner: id
    }
  } else if (eventRange === 'filterDate' && eventType === 'all') { 
    query = {
      date: { $gt: dateForFilter },
      owner: id
    }
  } else if (eventRange === 'all' && eventType !== 'all') {
    query = {
      type: eventType,
      owner: id
    }
  } else {
    query = { owner: id }
  }


  Pet.findById(id)
  .populate('owner')
  .then(pet => {
    Event.find(query)
    .sort({ date: 1 })
    .then(events => {
      const obj = {
        pet,
        user,
        events
      }
      res.render('pet', {obj})
    })
    .catch(error => {
      console.log('>>> Pois é, não rolou, estamos no catch do Event: ', error)
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


})

// pet details
router.get('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const user = req.user;
  const { id } = req.params;
  
  let dateNow = new Date()
  let yearNow = dateNow.getFullYear()
  let monthNow = dateNow.getMonth()
  let dayNow = dateNow.getDate()

  if (monthNow < 10) monthNow = `0${monthNow}`
  if (dayNow < 10) dayNow = `0${dayNow}`
  const dateForFilter = `${yearNow}-${monthNow}-${dayNow}`

  Pet.findById(id)
  .populate('owner')
  .then(pet => {
    Event.find({ owner:id, date: { $gt: dateForFilter }})
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
    const customUrl = req.file.url.split('upload/').join('upload/c_thumb,g_auto,h_500,r_0,w_500,x_0/');
    
    Pet.create({
      name,
      species,
      birthdate,
      owner: id,
      path: customUrl,
      originalName: req.file.originalname
    })
    .then(pet => {
      console.log('Pet criado com sucesso', pet);
      res.redirect('/pet/' + pet._id);  
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
      res.redirect('/pet/' + pet._id);
    })
    .catch(error => console.log('Falha ao criar pet: ', error));
  }
});

// pet edit photo
router.post('/edit/photo/:id', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const id = req.params.id;
  const customUrl = req.file.url.split('upload/').join('upload/c_thumb,g_auto,h_500,r_0,w_500,x_0/');

  Pet.findByIdAndUpdate(id, {
    path: customUrl,
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

  const customUrl = req.file.url.split('upload/').join('upload/c_thumb,g_auto,h_500,r_0,w_500,x_0/');

  if (req.file) {
    Pet.findByIdAndUpdate(id, {
      name, 
      species, 
      birthdate,
      path: customUrl,
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
