const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../../app');  

chai.use(chaiHttp);
const expect = chai.expect;

describe('Controladores de Productos', () => {

  describe('GET /products', () => {
    it('debería devolver todos los productos si el usuario está autenticado', async () => {
      const res = await chai.request(app).get('/products').set('Authorization', 'Bearer <TOKEN>');

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('productos');
    });

    it('debería redirigir al inicio de sesión si el usuario no está autenticado', async () => {
      const res = await chai.request(app).get('/products');

      expect(res).to.have.status(401);
      expect(res.redirect).to.include('/session/login');
    });
  });

  describe('POST /products', () => {
    it('debería crear un nuevo producto si el usuario es Admin', async () => {

      const res = await chai
        .request(app)
        .post('/products')
        .set('Authorization', 'Bearer <TOKEN>')
        .send({
          title: 'Nuevo Producto',
          description: 'Descripción del nuevo producto',
          price: 19.99,
          thumbnail: 'url_de_la_imagen',
          code: 'ABC123',
          stock: 10,
        });

      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Producto agregado exitosamente');
      expect(res.body).to.have.property('producto');
    });

    it('debería devolver un error si el usuario no es Admin', async () => {

      const res = await chai
        .request(app)
        .post('/products')
        .set('Authorization', 'Bearer <TOKEN>')
        .send({
          title: 'Nuevo Producto',
          description: 'Descripción del nuevo producto',
          price: 19.99,
          thumbnail: 'url_de_la_imagen',
          code: 'ABC123',
          stock: 10,
        });

      expect(res).to.have.status(403);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error').to.equal('Solo el Admin puede crear nuevos productos');
    });
  });


});
