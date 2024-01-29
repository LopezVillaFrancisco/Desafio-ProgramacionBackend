const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../../app');  // Asegúrate de ajustar la ruta del archivo principal de tu aplicación

chai.use(chaiHttp);
const expect = chai.expect;

describe('Controladores de Productos', () => {
  // Antes de comenzar las pruebas, podrías insertar algunos datos de prueba en la base de datos si es necesario

  describe('GET /products', () => {
    it('debería devolver todos los productos si el usuario está autenticado', async () => {
      // Supongamos que necesitas un usuario autenticado para acceder a la lista de productos
      // Puedes autenticar un usuario aquí y obtener su token
      // Luego, realizar la solicitud GET /products con el token en el encabezado de autorización

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
      // Similar a la prueba anterior, autentica un usuario con rol Admin y obtén su token
      // Luego, realiza la solicitud POST /products con el token y los datos del nuevo producto

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
      // Similar a la prueba anterior, autentica un usuario sin rol Admin y obtén su token
      // Luego, realiza la solicitud POST /products con el token y los datos del nuevo producto

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

  // Puedes continuar agregando pruebas para las demás rutas y casos de uso

  // Después de todas las pruebas, podrías limpiar los datos de prueba de la base de datos si es necesario
  after(() => {
    // Código para limpiar la base de datos de prueba
  });
});
