const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const ensureLogin = require("connect-ensure-login");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

// event add
router.post('/add/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const { title, type, description, date } = req.body;
    const id = req.params.id;
    
    Event.create({title, type, description, date, owner: id})
    .then( event => {
        console.log(`${event} criado com sucesso!!!`)
        
        if(!req.user.accessToken){
            console.log('Estou naquele If')
            res.redirect('/pet/'+ id) 
            return
        }

        const { refreshToken } = req.user;
        oAuth2Client.setCredentials({ refresh_token: refreshToken });

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const eventStartTime = date;
        const eventEndTime = date;
        // eventEndTime.setMinutes(eventEndTime.getMinutes() + 60);

        console.log('Início: ', eventStartTime)
        console.log('Término: ', eventEndTime)

        const calendarEvent = {
            summary: title,
            description: type,
            start: { date: eventStartTime },
            end: { date: eventEndTime },
            colorId: 5,
        };

        calendar.events.insert(
            {
                calendarId: 'primary',
                resource: calendarEvent,
            },
            (err, calendarEvent) => {
                if (err) return console.log('>>> Erro ao criar evento no calendário: ', err)
                Event.findByIdAndUpdate(event._id, { googleId: calendarEvent.data.id }, { new: true })
                .then((updatedEvent) => {
                    console.log('googleId adicionado ao evento: ', updatedEvent);
                    console.log('>>> Deu certo, evento criado no calendário. Parabéns!');
                })
                .catch(() => console.log('>>> Erro ao obter ID do evento'))
            }
        );

        res.redirect('/pet/'+ id) // id do pet
    })
    .catch(error => {
        console.log("Falha ao criar o evento ", error)
        res.redirect('/pet/'+ id)
    })
})

// event edit
router.post('/edit/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const {title, type, description, date} = req.body;
    const id = req.params.id; //id do evento

    Event.findByIdAndUpdate(id, {title, type, description, date}, {new: true})
    .then( event => {

        if(!req.user.accessToken){
            console.log(`${event} editado com sucesso!!!`)
            res.redirect('/pet/'+ event.owner)
            return
        }

        const { refreshToken } = req.user;
        oAuth2Client.setCredentials({ refresh_token: refreshToken });

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const calendarEvent = {
            summary: title,
            description: type,
            start: { date },
            end: { date },
            colorId: 5,
        };

        calendar.events.update(
            {
                calendarId: 'primary',
                eventId: event.googleId,
                resource: calendarEvent,
            }, 
            (err, calendarEvent) => {
                if (err) return console.log('>>> Erro ao editar evento no calendário: ', err)
                Event.findByIdAndUpdate(event._id, { googleId: calendarEvent.data.id }, { new: true })
                .then((updatedEvent) => {
                    console.log('googleId editado ao evento: ', updatedEvent);
                    console.log('>>> Deu certo, evento editado no calendário. Parabéns!');
                })
                .catch(() => console.log('>>> Erro ao obter ID do evento'))
            }
        )

        res.redirect('/pet/'+ event.owner)
    })
    .catch(error => {
        console.log('Falha ao editar o event', error)
        res.redirect('/pet/'+ id)
    });
})

// event delete
router.get('/delete/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const id = req.params.id;

    Event.findByIdAndDelete(id)
    .then(event => {
        if(!req.user.accessToken){
            console.log(`${event} deletado!!!`);
            res.redirect('/pet/'+ event.owner)
            return
        }

        const { refreshToken } = req.user;
        oAuth2Client.setCredentials({ refresh_token: refreshToken });

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        calendar.events.delete(
            {
                calendarId: 'primary',
                eventId: event.googleId
            }, 
            err => {
                if (err) return console.log('>>> Erro ao editar evento no calendário: ', err)
                console.log('>>> Deu certo, evento deletado no calendário. Parabéns!');
            }
        );

        console.log(`${event} deletado!!!`);
        res.redirect('/pet/'+ event.owner)
    })
    .catch(error => {
        console.log('Falha ao deletar evento ', error)
        res.redirect('/pet/'+ id)
    });
})

module.exports = router;
