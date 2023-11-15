const express = require('express');
const { Router } = express;
const router = Router();
const Product = require('../dao/Mongo/models/products.models');
const http = require('http');
const socketIo = require('socket.io'); 
const passport = require('passport')

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.rol === 'Admin') {
    return next();
  }
  res.status(403).send('Solo el Admin puede crear nuevos productos');
};

router.get('/', async (req, res) => {
  try {
    const productos = await Product.find().lean(true);
    res.render('home', { productos: productos });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los productos',
    });
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const productos = await Product.find().lean(true);
    res.render('realTimeProducts', { productos: productos });
    console.log(productos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los productos',
    });
  }
});
router.post('/realtimeproducts', passport.authenticate('login', { session: true }), isAdmin, async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;

    if (req.user.rol !== 'Admin') {
      return res.status(403).json({
        error: 'Solo el Admin puede crear nuevos productos',
      });
    }

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return res.status(400).json({
        error: 'Faltan campos requeridos en la solicitud',
      });
    }

    const nuevoProducto = new Product({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    await nuevoProducto.save();

    res.status(201).json({
      message: 'Producto agregado exitosamente',
      producto: nuevoProducto,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al agregar el producto',
    });
  }
});

router.put('/:id', async (req, res) => {
  usuario = req.user
  if (!usuario.rol === 'Admin') {
    return res.render('Solo el Admin puede crear nuevos Producutos')
  }
  try {
    const productId = req.params.id;
    const { title, description, price, thumbnail, code, stock } = req.body;

    await Product.findByIdAndUpdate(productId, { title, description, price, thumbnail, code, stock });

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el producto',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting the product'
    });
  }
});

module.exports = router;
