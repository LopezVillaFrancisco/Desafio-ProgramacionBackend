const express = require('express');
const router = express.Router();
const cartController = require('../dao/Mongo/controllers/CartsController');

router.post('/', cartController.createCart);
router.post('/:cid/product/:pid', cartController.addProductToCart);
router.get('/:cid', cartController.getCartById);
router.delete('/:cid/products/:pid', cartController.deleteProductFromCart);
router.delete('/:cid', cartController.deleteCart);
router.put('/:cid/product/:pid', cartController.editProductInCart);
router.get('/:cid/purchase', cartController.purchaseCart);

module.exports = router;
