const express = require('express');
const router = express.Router();

const ensureLogin = require('connect-ensure-login');

const eventController = require('../controllers/eventControllers');

// Event Add
router.post('/add/:id', ensureLogin.ensureLoggedIn(), eventController.postEventAdd);

// Event Edit
router.post('/edit/:id', ensureLogin.ensureLoggedIn(), eventController.postEventEdit);

// Event Delete
router.get('/delete/:id', ensureLogin.ensureLoggedIn(), eventController.getEventDelete);

module.exports = router;
