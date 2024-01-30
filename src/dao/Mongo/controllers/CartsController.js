const cartModel = require("../models/Cart");
const productsModel = require("../models/products.models");
const Ticket = require('../models/Ticket');
const mongoose = require('mongoose');
const generateTicketCode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};
const cartController = {
  createCart: async (req, res) => {
    try {
      const lastProduct = await cartModel.findOne({}, {}, { sort: { id: -1 } });
      const lastId = lastProduct ? lastProduct.id : 0;
      const nextId = lastId + 1;

      let newCart = await cartModel.create({
        id: nextId,
        products: []
      });

      await newCart.save();

      res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });

    } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
  },

  addProductToCart: async (req, res) => {
    const usuario = req.user;
    if (usuario && usuario.rol === 'Admin') {
      const errorMessage = 'Los administradores no pueden agregar productos al carrito.'; 
      return res.status(400).json({ error: errorMessage, isAdmin: true });
    }

    try {
      const { cid, pid } = req.params;

      const cart = await cartModel.findOne({ _id: cid });
      const product = await productsModel.findOne({ _id: pid });

      if (!cart || !product) {
        return res.status(404).json({ error: 'Carrito o producto no encontrado' });
      }

      const existingProductIndex = cart.products.findIndex(item => item.product.toString() === product._id.toString());

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: product._id, quantity: 1 });
      }

      await cart.save();
      const newCart = await cartModel.findOne({ id: parseInt(cid) });

      res.status(200).json({ message: 'Producto agregado al carrito con éxito', newCart });
    } catch (error) {
      res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
  },

  getCartById: async (req, res) => {
    const cartId = req.params.cid;

    try {
      const cart = await cartModel.findOne({ id: cartId });
      if (!cart) {
        res.status(404).json({ error: `No se encontró ningún carrito con id ${cartId}` });
      } else {
        res.json({ cart });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener el carrito' });
    }
  },

  deleteProductFromCart: async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ error: 'Los valores ingresados no son válidos' });
    }

    try {
      const cart = await cartModel.findById(cartId);

      const productIndex = cart.products.findIndex(product => product.product.toString() === productId);

      if (productIndex === -1) {
        return res.status(404).json({ error: `No existe un producto con id ${productId}` });
      }

      cart.products.splice(productIndex, 1);
      await cart.save();

      res.status(200).json({ message: 'Producto eliminado del carrito con éxito', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al borrar el producto' });
    }
  },

  deleteCart: async (req, res) => {
    try {
      const { cid } = req.params;

      const cart = await cartModel.findOne({ id: parseInt(cid) });

      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      cart.products = [];
      await cart.save();

      res.status(200).json({ message: 'Se eliminaron los productos del carrito', cart });
    } catch (error) {
      res.status(500).json({ error: 'Error al borrar el carrito' });
    }
  },

  editProductInCart: async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(productId) || isNaN(quantity)) {
      return res.status(400).json({ error: 'Los valores ingresados no son válidos' });
    }

    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        return res.status(404).json({ error: `El carrito con ID ${cartId} no existe` });
      }

      const productoRepetido = cart.products.find(product => product.product.toString() === productId);

      if (productoRepetido) {
        productoRepetido.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      res.status(200).json({ message: 'Producto editado en el carrito con éxito', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al editar el producto' });
    }
  },

  purchaseCart: async (req, res) => {
    try {
      const cartId = req.params.cid;
  
      const cart = await cartModel.findById(cartId).populate('products.product');
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      const productosComprar = [];
      const productosSinStock = [];
  
      for (const item of cart.products) {
          productosComprar.push(item.product);
      }
  
      if (productosComprar.length > 0) {
        const code =  generateTicketCode();
  
        const ticket = new Ticket({
          code: code,
          amount: productosComprar.length
        });
  
        await ticket.save();
    
        await cart.save();
  
        res.status(200).json({ message: 'Compra exitosa', ticket });
      } else {
        res.status(400).json({ message: 'No hay suficiente stock para algunos productos', productosSinStock });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al procesar la compra del carrito' });
    }
  },
};

module.exports = cartController;
