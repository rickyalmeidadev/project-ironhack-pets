const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexControllers');

router.get('/', indexController.getIndex);

// fix passport failure redirection
router.get('/login', (req, res) => res.redirect('/'));

module.exports = router;
