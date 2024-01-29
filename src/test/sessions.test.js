const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../../app');
const UserModel = require('../dao/Mongo/models/Usuario');

chai.use(chaiHttp);
const expect = chai.expect;

describe('API de Sesiones', () => {
  describe('GET /session/login', () => {
    it('debería devolver la página de inicio de sesión', async () => {
      const res = await chai.request(app).get('/session/login');
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });
  });

  describe('GET /session/singUp', () => {
    it('debería devolver la página de registro', async () => {
      const res = await chai.request(app).get('/session/singUp');
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });
    it('debería devolver la página de registro con mensaje de error', async () => {
      const res = await chai.request(app).get('/session/singUp?error=Error%20en%20el%20registro');
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });

    it('debería devolver la página de registro con mensaje de usuario creado', async () => {
      const res = await chai.request(app).get('/session/singUp?usuarioCreado=Usuario%20creado%20exitosamente');
      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });
  });

  describe('GET /session/perfil', () => {
    it('debería devolver la página de perfil si el usuario está autenticado', async () => {
      const userLoginRes = await chai
        .request(app)
        .post('/session/login')
        .send({ email: 'aa2@gmail.com', password: '123' });

      const userToken = userLoginRes.body.token;
      const res = await chai
        .request(app)
        .get('/session/perfil')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res).to.have.status(200);
      expect(res).to.be.html;
    });

    it('debería redirigir al inicio de sesión si el usuario no está autenticado', async () => {
      await chai.request(app).get('/session/logout');
      const res = await chai.request(app).get('/session/perfil');
      expect(res).to.have.status(401);
      expect(res.redirect).to.include('/session/login');
    });
  });

  describe('GET /session/current', () => {
    it('debería devolver el usuario actual si está autenticado', async () => {
      const loginRes = await chai
        .request(app)
        .post('/session/loginPost')
        .send({ email: 'aa2@gmail.com', password: '123' });
      const userToken = loginRes.body.token;
      const res = await chai.request(app).get('/session/current').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.have.property('usuario');
    });
  });

  describe('POST /session/registro', () => {
    let testUser;

    it('debería registrar un nuevo usuario correctamente', async () => {
      const res = await chai
        .request(app)
        .post('/session/registro')
        .send({ email: 'aa3@gmail.com', password: '12345' });

      expect(res).to.have.status(200);
      expect(res).to.be.redirect;
      testUser = { email: 'aa3@gmail.com', password: '12345' };
    });

    it('debería manejar el registro de un usuario que ya existe', async () => {
      await chai.request(app).get('/session/logout');
      const res = await chai
        .request(app)
        .post('/session/registro')
        .send({ email: 'aa2@gmail.com', password: '123' });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error').to.equal('Usuario ya registrado.');
    });

    after(async () => {
      if (testUser) {
        try {
          await UserModel.deleteOne({ email: testUser.email });
        } catch (error) {
          console.error('Error al eliminar el usuario de la base de datos:', error);
        }
      }
    });
  });

  describe('POST /session/loginPost', () => {
    it('debería iniciar sesión y redirigir al perfil', async () => {
      const res = await chai
        .request(app)
        .post('/session/loginPost')
        .send({ email: 'aa2@gmail.com', password: '123' });

      expect(res).to.have.status(200);
      expect(res).to.redirectTo(/\/session\/perfil/);
    });

    it('debería manejar el fallo de inicio de sesión', async () => {
      await chai.request(app).get('/session/logout');
      const res = await chai
        .request(app)
        .post('/session/loginPost')
        .send({ email: 'usuarioNoExistente@gmail.com', password: 'claveIncorrecta' });

      expect(res).to.have.status(200);
      expect(res).to.redirectTo(/\/session\/login/);
    });
  });

  describe('GET /session/logout', () => {
    let userToken;

    before(async () => {
      const userLoginRes = await chai
        .request(app)
        .post('/session/login')
        .send({ email: 'aa2@gmail.com', password: '123' });

      userToken = userLoginRes.body.token;
    });

    it('debería realizar el logout y redirigir a la página de inicio de sesión', async () => {
      const res = await chai.request(app).get('/session/logout').set('Authorization', `Bearer ${userToken}`);

      expect(res).to.have.status(200);
      expect(res).to.redirect;
      expect(res.redirects[0]).to.include('/session/login');
    });
  });
});
