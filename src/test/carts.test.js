const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Rutas del Carrito', () => {
  
  describe('POST /api/carts', () => {
    it('debería crear un nuevo carrito', async () => {  
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes 
      const res = await chai
        .request(app)
        .post('/api/carts')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message').to.equal('Carrito creado con éxito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('POST /api/carts/:cid/product/:pid', () => {
    it('debería agregar un producto al carrito', async () => {
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes
      const res = await chai
        .request(app)
        .post('/api/carts/1/product/651f5bb5f8d269d262598418')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message').to.equal('Producto agregado al carrito con éxito');
      expect(res.body).to.have.property('newCart');
    });
  });

  describe('GET /api/carts/:cid', () => {
    it('debería obtener un carrito por ID', async () => { 
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes
      const res = await chai
        .request(app)
        .get('/api/carts/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('cart');
    });
  });

  describe('DELETE /api/carts/:cid/products/:pid', () => {
    it('debería eliminar un producto del carrito', async () => { 
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes
      const res = await chai
        .request(app)
        .delete('/api/carts/1/products/651f5bb5f8d269d262598418')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message').to.equal('Producto eliminado del carrito con éxito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('DELETE /api/carts/:cid', () => {
    it('debería eliminar un carrito', async () => {
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes
      const res = await chai
        .request(app)
        .delete('/api/carts/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message').to.equal('Se eliminaron los productos del carrito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('PUT /api/carts/:cid/product/:pid', () => {
    it('debería editar un producto en el carrito', async () => { 
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes
      const res = await chai
        .request(app)
        .put('/api/carts/1/product/651f5bb5f8d269d262598418')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 2 });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message').to.equal('Producto editado en el carrito con éxito');
      expect(res.body).to.have.property('cart');
    });
  });

  describe('GET /api/carts/:cid/purchase', () => {
    it('debería comprar el carrito', async () => { 
      const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'aa2@gmail.com', password: '123' }); 
      const userToken = userLoginRes
      const res = await chai
        .request(app)
        .get('/api/carts/1/purchase')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message').to.equal('Compra exitosa');
      expect(res.body).to.have.property('ticket');
    });
  });
});
