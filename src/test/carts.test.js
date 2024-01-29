const chai = require('chai');
const chaiHttp = require('chai-http');
const {app,server} = require('../../app');
chai.use(chaiHttp);
const expect = chai.expect;

describe('API de Carrito', () => {
  let userToken;
  let adminToken;

  before(async () => {
    const userLoginRes = await chai
      .request(app)
      .post('/api/cart')  
      .send({ email: 'aa2@gmail.com', password: '123' });

    userToken = userLoginRes.body.token;

    const adminLoginRes = await chai
      .request(app)
      .post('/api/cart')  
      .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });

    adminToken = adminLoginRes.body.token;
  });

  describe('POST /api/cart', () => {  
    it('debería crear un carrito nuevo', async () => {
      const res = await chai.request(app).post('/api/cart').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Carrito creado con éxito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('PUT /api/cart/1/product/:pid', () => {
    it('debería agregar un producto al carrito', async () => {
      const res = await chai.request(app).put('/api/cart/1/product/651c87fd8913a995b16e7687').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Producto agregado al carrito con éxito');
      expect(res.body).to.have.property('newCart');
    });

    it('debería manejar la adición de productos por un administrador', async () => {
      const res = await chai.request(app).put('/api/cart/1/product/651c87fd8913a995b16e7687').set('Authorization', `Bearer ${adminToken}`);
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error');
      expect(res.body).to.have.property('isAdmin').to.be.true;
    });
  });

  describe('GET /api/cart/1', () => {
    it('debería obtener el carrito por ID', async () => {
      const res = await chai.request(app).get('/api/cart/1').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('cart');
    });

    it('debería manejar la obtención de un carrito inexistente', async () => {
      const res = await chai.request(app).get('/api/cart/999').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error');
    });
  });

  describe('DELETE /api/cart/1/product/:pid', () => {
    it('debería eliminar un producto del carrito', async () => {
      const res = await chai.request(app).delete('/api/cart/1/product/651c87fd8913a995b16e7687').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Producto eliminado del carrito con éxito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('DELETE /api/cart/1', () => {
    it('debería eliminar todos los productos del carrito', async () => {
      const res = await chai.request(app).delete('/api/cart/1').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Se eliminaron los productos del carrito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('PUT /api/cart/1/product/:pid', () => {
    it('debería editar la cantidad de un producto en el carrito', async () => {
      const res = await chai.request(app).put('/api/cart/1/product/651c87fd8913a995b16e7687').send({ quantity: 5 }).set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Producto editado en el carrito con éxito');
      expect(res.body).to.have.property('cart');
    });

    it('debería manejar la edición de un producto en un carrito inexistente', async () => {
      const res = await chai.request(app).put('/api/cart/999/product/651c87fd8913a995b16e7687').send({ quantity: 5 }).set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error');
    });

    it('debería manejar la edición de un producto inexistente en el carrito', async () => {
      const res = await chai.request(app).put('/api/cart/1/product/999').send({ quantity: 5 }).set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error');
    });

    it('debería manejar la edición con valores no válidos', async () => {
      const res = await chai.request(app).put('/api/cart/1/product/651c87fd8913a995b16e7687').send({ quantity: 'invalid_quantity' }).set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /api/cart/1/purchase', () => {
    it('debería realizar la compra del carrito', async () => {
      const res = await chai.request(app).post('/api/cart/1/purchase').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Compra exitosa');
      expect(res.body).to.have.property('ticket');
    });

    it('debería manejar la compra de un carrito inexistente', async () => {
      const res = await chai.request(app).post('/api/cart/999/purchase').set('Authorization', `Bearer ${userToken}`);
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('error');
    });

    it('debería manejar la compra sin un usuario autenticado', async () => {
      const res = await chai.request(app).post('/api/cart/1/purchase');
      expect(res).to.have.status(401);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message').to.equal('Usuario no autenticado');
    });
  });
});
