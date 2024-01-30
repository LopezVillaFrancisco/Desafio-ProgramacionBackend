const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('POST /api/products', () => {
  let productId; 
  describe('GET /api/products', () => {
    it('debería obtener todos los productos', async () => {
      const userLoginRes = await chai
        .request(app)
        .post('/session/login')
        .send({ email: 'aa2@gmail.com', password: '123' });
      const userToken = userLoginRes.body.token;
      const res = await chai
        .request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).to.equal(200);
    });
  });
  it('debería crear un nuevo producto', async () => {
    const adminLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });
    const adminToken = adminLoginRes.body.token;

    const newProduct = {
      title: 'Producto Prueba',
      description: 'Producto Prueb',
      price: 39.99,
      thumbnail: 'url_imagen.jpg',
      code: 'Prueba123',
      stock: 30,
    };

    const res = await chai
      .request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProduct);

    expect(res.status).to.equal(201);
    productId = res.body.producto._id; 
  });

  it('debería obtener productos en tiempo real', async () => {
    const userLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: '', password: '123' });
    const userToken = userLoginRes.body.token;

    const res = await chai
      .request(app)
      .get('/api/products/realtimeproducts')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).to.equal(200);
  });

  it('debería actualizar un producto', async () => {
    const adminLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });
    const adminToken = adminLoginRes.body.token;

    const updatedProductRes = await chai
      .request(app)
      .put(`/api/products/${productId}`) 
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Producto actualizado',
        description: 'Descripción actualizada',
        price: 29.99,
        thumbnail: 'nueva_imagen.jpg',
        code: 'ACTUALIZADO456',
        stock: 15,
      });

    expect(updatedProductRes.status).to.equal(200);
  });

  it('debería eliminar un producto', async () => {
    const adminLoginRes = await chai
      .request(app)
      .post('/session/login')
      .send({ email: 'adminCoder@coder.com', password: 'adminCod3r123' });
    const adminToken = adminLoginRes.body.token;

    const deleteProductRes = await chai
      .request(app)
      .delete(`/api/products/${productId}`) 
      .set('Authorization', `Bearer ${adminToken}`);

    expect(deleteProductRes.status).to.equal(200);
  });
});
