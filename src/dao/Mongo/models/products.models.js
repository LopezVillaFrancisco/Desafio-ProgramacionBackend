const mongoose = require('mongoose');

const productsColeccion='products'; 
const productEsquema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
  },
  code: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  }
});

const Product = mongoose.model(productsColeccion, productEsquema);

module.exports = Product;
