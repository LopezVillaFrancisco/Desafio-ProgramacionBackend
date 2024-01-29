const express = require('express');
const session = require('express-session');
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const productsRouter = require('./src/Routes/products.router');
const cartsRouter = require('./src/Routes/carts.router');
const sessionRouter = require('./src/Routes/sessions.router');
const http = require('http');
const socketIo = require('socket.io');
const passport = require('passport');
const { initPassport } = require('./src/config/passport.config');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 8080;

app.use(session({ secret: 'palabraSecreta', resave: true, saveUninitialized: true }));

app.engine(
  'handlebars',
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true
    }
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));
initPassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect('mongodb+srv://franlopezvilla5:coderhouse123@ecommerce.wdtftbn.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
  .then(() => {
    console.log('Db connected');
  })
  .catch((error) => console.log(error));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de tu aplicación',
      version: '1.0.0',
      description: 'Documentación de la API de tu aplicación'
    }
  },
  apis: ['./doc/*yaml'] 
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/session', sessionRouter);
app.get('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).render('chat');
});


const server = http.createServer(app);

const io = socketIo(server);

let mensajes = [
  {
    emisor: 'Server',
    mensaje: 'Bienvenido al chat',
  },
];

let users = [];

io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('id', (nombre) => {
    users.push({
      id: socket.id,
      nombre,
    });
    socket.emit('bienvenida', mensajes);

    socket.broadcast.emit('newUser', nombre);
  });
  socket.on('nuevoMensaje', (mensaje) => {
    mensajes.push(mensaje);
    io.emit('newMessage', mensaje);
  });
})

server.listen(port, () => {
  console.log(`Corriendo el server en el puerto ${port}`);
})
module.exports = { app, server };