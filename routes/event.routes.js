const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


// event add
router.post('/add/:id', (req, res, next) => {

const {title, type, description, date} = req.body;
const id = req.params.id;

Event.create({title, type, description, date, owner:id})
.then( event => {
    console.log(`${event} criado com sucesso!!!`)
    res.redirect('/pet/'+ id) // id do pet
})
.catch(error => console.log("Falha ao criar o evento ", error))
})

// event edit
router.post('/edit/:id', (req, res, next) => {
    const {title, type, description, date} = req.body;
    const id = req.params.id; //id do evento
    Event.findByIdAndUpdate(id, {title, type, description, date}, {new: true})
    .then( event => {
        console.log(`${event} editado com sucesso!!!`)
        res.redirect('/pet/'+ event.owner)
    })
    .catch(error => console.log('Falha ao editar o event', error));
})

// event delete
router.get('/delete/:id', (req, res, next) => {
    const id = req.params.id;
    Event.findByIdAndDelete(id)
    .then(event => {
    console.log(`${event} deletado!!!`);
    res.redirect('/pet/'+ event.owner)
    })
    .catch(error => console.log('Falha ao deletar evento ', error));
})


module.exports = router;