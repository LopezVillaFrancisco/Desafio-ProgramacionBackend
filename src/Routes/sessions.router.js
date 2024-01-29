const express = require('express'); 
const session = require('express-session'); 
const { Router } = express;
const router = Router();
const bodyParser = require('body-parser');
const sessionController = require('../dao/Mongo/controllers/SessionsController');

router.use(session({ secret: 'palabraSecreta', resave: true, saveUninitialized: true }));
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/logout', sessionController.setupSession);
router.get('/', sessionController.showLogin);
router.get('/singUp', sessionController.showSignUp);
router.get('/login', sessionController.showLoginWithDetails);
router.get('/perfil', sessionController.showProfile);
router.get('/current', sessionController.getCurrentUser);
router.post('/registro', sessionController.registerUser);
router.post('/loginPost', sessionController.loginUser);

module.exports = router;