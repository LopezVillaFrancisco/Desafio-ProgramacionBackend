const Product = require('../models/products.models');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const productos = await Product.find().lean(true);
      res.render('home', { productos: productos });
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener los productos',
      });
    }
  },

  getRealTimeProducts: async (req, res) => {
    try {
      const productos = await Product.find().lean(true);
      res.render('realTimeProducts', { productos: productos });
      console.log(productos);
    } catch (error) {
      res.status(500).json({
        error: 'Error al obtener los productos',
      });
    }
  },

  createProduct: async (req, res) => {
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
  },

  updateProduct: async (req, res) => {
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
  },

  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      await Product.findByIdAndDelete(productId);
      res.status(200).json({
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Error al eliminar el producto'
      });
    }
  },
};

module.exports = productController;
