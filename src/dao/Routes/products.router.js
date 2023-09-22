const express = require('express');
const { Router } = express;
const router = Router();
const Product = require('../models/products.models');

router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.render('home', { productos: productos }); 
    console.log(productos)
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los productos'
    });
  }
});

router.post('/', async (req, res) => {
    try {
      const { title, description, price, thumbnail, code, stock } = req.body;
  
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
        error: 'Error al agregar el producto2',
      });
    }
  });
  

router.put('/:id', async (req, res) => {
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
