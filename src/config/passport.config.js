const passport = require('passport');
const local = require('passport-local');
const bcrypt = require('bcrypt');
const modeloUsuarios = require('../dao/Mongo/models/Usuario');

const initPassport = () => {
  passport.use('registro', new local.Strategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        let { nombre, email, apellido } = req.body;
        if (!nombre || !apellido || !email || !password) {
          return done(null, false, { message: 'Complete nombre, apellido, email, y password' });
        }

        let existe = await modeloUsuarios.findOne({ email });
        if (existe) {
          return done(null, false, { message: `Ya existe el Usuario ${username}` });
        }
        if(email ==='adminCoder@coder.com' && password === 'adminCod3r123'){
          rol= 'Admin';
        }else{
          rol = 'Usuario'
        }
        let usuario = await modeloUsuarios.create({
          nombre, apellido, email,rol,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        });

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.use('login', new local.Strategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      try { 
        let usuario = await modeloUsuarios.findOne({ email: username });
        if (!usuario) {
          return done(null, false, { message: `No existe el usuario ${username}` });
        }

        if (!bcrypt.compareSync(password, usuario.password)) {
          return done(null, false, { message: `Credenciales inválidas` });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await modeloUsuarios.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

module.exports = { initPassport };
