const express = require('express');
const router = express.Router();

const ensureLogin = require('connect-ensure-login');
const uploadCloud = require('../config/cloudinary.js');
const petController = require('../controllers/petControllers');

// Pet Filter
router.get('/filter/:id', ensureLogin.ensureLoggedIn(), petController.getPetFilter);

// Pet Details
router.get('/:id', ensureLogin.ensureLoggedIn(), petController.getPetDetails);

// Pet Add
router.post('/add', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), petController.postPetAdd);

// Pet Edit Photo
router.post(
  '/edit/photo/:id',
  uploadCloud.single('photo'),
  ensureLogin.ensureLoggedIn(),
  petController.postPetEditPhoto
);

// Pet Edit Info
router.post('/edit/:id', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), petController.postPetEdit);

// Pet Delete
router.get('/delete/:id', ensureLogin.ensureLoggedIn(), petController.getPetDelete);

module.exports = router;
