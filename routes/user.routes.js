const express = require('express');
const router = express.Router();

const ensureLogin = require("connect-ensure-login");
const userController = require('../controllers/userControllers');

router.get('/', ensureLogin.ensureLoggedIn(), userController.getUserDashboard);

module.exports = router;
