const passport = require('passport');

const sessionController = {
  setupSession: (req, res, next) => {
    res.status(200).redirect('/session/login?mensaje=logout realizado');
    req.logout(next);
  },

  showLogin: (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/session/perfil');
    }
    res.status(200).render('login', { verLogin: true });
  },

  showSignUp: (req, res) => {
    let error = false;
    let errorDetalle = '';
    if (req.query.error) {
      error = true;
      errorDetalle = req.query.error;
    }
    res.status(200).render('singUp', { verLogin: true, error, errorDetalle });
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
    res.status(200).render('login', { verLogin: true, usuarioCreado, usuarioCreadoDetalle, error, errorDetalle });
  },

  showProfile: (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.status(200).render('perfil', { verLogin: false, perfil: req.user });
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
    passport.authenticate('registro', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.status(409).redirect(`/session/singUp?error=${info.message ? info.message : info.toString()}`); }
      return res.status(200).redirect(`/session/login?usuarioCreado=Usuario ${user.nombre} registrado correctamente. Username: ${user.email}`);
    })(req, res, next);
  },

  loginUser: (req, res, next) => {
    passport.authenticate('loginPost', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        return res.status(401).redirect(`/session/login?error=${info.message ? info.message : info.toString()}`);
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.status(200).redirect(`/session/perfil?mensaje=Usuario ${user.nombre} logueado correctamente. Rol: ${user.rol}`);
      });
    })(req, res, next);
  },  
};

module.exports = sessionController;
