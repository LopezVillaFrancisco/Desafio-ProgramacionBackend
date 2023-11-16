const express = require('express');
const { Router } = express;
const router = Router();
const session = require('express-session');
const usuariosModelo = require('../dao/Mongo/models/Usuario')
const bodyParser = require('body-parser'); 
const passport = require('passport');

router.use(session({ secret: 'palabraSecreta', resave: true, saveUninitialized: true }));
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/session/login?mensaje=logout realizado');
  });
});

router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/session/perfil');
  }
  res.status(200).render('login', {
    verLogin: true,
  });
});


router.get('/singUp', (req, res) => {
  let error = false;
  let errorDetalle = '';
  if (req.query.error) {
    error = true;
    errorDetalle = req.query.error;
  }
  res.status(200).render('singUp', {
    verLogin: true,
    error,
    errorDetalle,
  });
});

router.get('/login', (req, res) => {
  let error = false;
  let errorDetalle = '';
  if (req.query.error) {
    error = true;
    errorDetalle = req.query.error;
  }
  let usuarioCreado = false;
  let usuarioCreadoDetalle = '';
  if (req.query.usuarioCreado) {
    usuarioCreado = true;
    usuarioCreadoDetalle = req.query.usuarioCreado;
  }
  res.status(200).render('login', {
    verLogin: true,
    usuarioCreado,
    usuarioCreadoDetalle,
    error,
    errorDetalle,
  });
});

router.get('/perfil', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    console.log('Usuario autenticado:', req.user); 
    console.log("nombre",req.user.nombre,' ',req.user.apellido)
    console.log('Email ', req.user.email)
    console.log('rol ', req.user.rol)
    res.status(200).render('perfil', {
      verLogin: false,
      perfil: req.user,
    });
  } else {
    res.status(401).redirect('/session/login?mensaje=Debes iniciar sesión para acceder al perfil');
  }
});

router.get('/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ usuario: req.user });
  } else {
    res.status(401).json({ mensaje: 'No autorizado' });
  }
});
router.post('/registro', function(req, res, next) {
  passport.authenticate('registro', function(err, user, info, status) {
    if (err) { return next(err) }
    if (!user) { return res.redirect(`/session/singUp?error=${info.message?info.message:info.toString()}`) }
    console.log('Usuario registrado:', user);
    req.user = user;
    return next();
  })(req, res, next);
}, (req, res) => {
  res.status(200).redirect(`/session/login?mensaje=Usuario ${req.user.nombre} registrado correctamente. Username: ${req.user.email}`);
});

router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info, status) {
    if (err) { return next(err); }
    if (!user) { 
      return res.redirect(`/session/login?error=${info.message ? info.message : info.toString()}`);
    }
    console.log('Usuario logueado:', user);
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect(`/session/perfil?mensaje=Usuario ${user.nombre} logueado correctamente. Rol: ${user.rol}`);
    });
  })(req, res, next);
});

module.exports = router;

