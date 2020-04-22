const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers');

// Sign Up Route
router.post('/signup', authController.postSignUp);

// Login Route
router.post('/login', authController.postLogin);

// Logout Route
router.get('/logout', authController.getLogout);

// Social Login
router.get('/google', authController.getGoogle);
router.get('/google/callback', authController.getGoogleCallback);

module.exports = router;
