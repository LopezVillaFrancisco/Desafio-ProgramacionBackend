const express = require('express');
const { Router } = express;
const router = Router();
const passport = require('passport');
const productController = require('../dao/Mongo/controllers/ProductsController');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.get('/realtimeproducts', productController.getRealTimeProducts);
router.post('/realtimeproducts', passport.authenticate('login', { session: true }), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
