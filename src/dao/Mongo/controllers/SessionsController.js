const passport = require('passport');

const sessionController = {
  setupSession: (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/session/login?mensaje=logout realizado');
    });
  },

  showLogin: (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/session/perfil');
    }
    res.status(200).render('login', {
      verLogin: true,
    });
  },

  showSignUp: (req, res) => {
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
  },

  showLoginWithDetails: (req, res) => {
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
  },

  showProfile: (req, res) => {
    if (req.isAuthenticated() && req.user) {
      console.log('Usuario autenticado:', req.user);
      console.log("nombre", req.user.nombre, ' ', req.user.apellido);
      console.log('Email ', req.user.email);
      console.log('rol ', req.user.rol);
      res.status(200).render('perfil', {
        verLogin: false,
        perfil: req.user,
      });
    } else {
      res.status(401).redirect('/session/login?mensaje=Debes iniciar sesión para acceder al perfil');
    }
  },

  getCurrentUser: (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).json({ usuario: req.user });
    } else {
      res.status(401).json({ mensaje: 'No autorizado' });
    }
  },

  registerUser: (req, res, next) => {
    passport.authenticate('registro', (err, user, info, status) => {
      if (err) { return next(err); }
      if (!user) { return res.redirect(`/session/singUp?error=${info.message ? info.message : info.toString()}`); }
      console.log('Usuario registrado:', user);
      req.user = user;
      return next();
    })(req, res, next);
  },

  handleRegistrationResponse: (req, res) => {
    res.status(200).redirect(`/session/login?mensaje=Usuario ${req.user.nombre} registrado correctamente. Username: ${req.user.email}`);
  },

  loginUser: (req, res, next) => {
    passport.authenticate('login', (err, user, info, status) => {
      if (err) { return next(err); }
      if (!user) {
        return res.redirect(`/session/login?error=${info.message ? info.message : info.toString()}`);
      }
      console.log('Usuario logueado:', user);
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.redirect(`/session/perfil?mensaje=Usuario ${user.nombre} logueado correctamente. Rol: ${user.rol}`);
      });
    })(req, res, next);
  },
};

module.exports = sessionController;
