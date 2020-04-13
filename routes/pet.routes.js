const express = require('express');
const router = express.Router();

const Pet = require('../models/Pet');

router.get('/:id', (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  Pet.findById(id)
  .populate('User')
  .then(pet => {
    const obj = {
      pet,
      user
    }

    res.render('pet', obj)
  })
  .catch(error => console.log('Falha ao acessar página do pet: ', error));
});

router.post('/add', (req, res, next) => {
  const { name, species, birthdate } = req.body;
  const id = req.user._id;


  Pet.create({
    name,
    species,
    birthdate,
    owner: id
  })
  .then(pet => {
    console.log('Pet criado com sucesso', pet);
    res.redirect('/user');
  })
  .catch(error => console.log('Falha ao criar pet: ', error));
});

module.exports = router;