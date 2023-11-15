const { Router } = require("express");
const cartModel = require("../dao/Mongo/models/Cart");
const modeloUsuarios = require("../dao/Mongo/models/Usuario");
const productsModel = require("../dao/Mongo/models/products.models"); 

const router = Router();

router.post('/', async (req, res) => {

    const lastProduct = await cartModel.findOne({}, {}, { sort: { id: -1 } });
    const lastId = lastProduct ? lastProduct.id : 0;
    const nextId = lastId + 1;
   
    
    try {
        let newCart = await cartModel.create({
            id: nextId,
            products: []
        })

        await newCart.save();


        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });

    } catch (error) {
        res.status(500).json({ error: 'error inesperado', detalle: error.message })
    }
});

router.post('/:cid/product/:pid', async (req, res) => { 
    usuario = req.user 
    if(usuario.rol === 'Admin'){
      return res.render('Solo los usuarios pueden agregar productos a un carrito')
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
});

router.get('/:cid', async (req, res) => {
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
});

router.delete('/:cid/products/:pid', async (req,res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;     

    if (!mongoose.isValidObjectId(cartId) || !mongoose.isValidObjectId(productId) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Los valores ingresados no son válidos' });
    }

    try{
        const cart = await Cart.findById(cartId);

        const productIndex = cart.products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ error: `No existe un producto con id ${productId}` });
        } 
        cart.products.slice(productIndex, 1)

    }catch (error) { 
        console.error(error)
        res.status(500).json({ error: 'Error al borrar el producto' });

    }
})

router.delete('/:cid', async (req, res) => { 
    
    try {
        const { cid } = req.params;
  
        const cart = await cartModel.findOne({ id: parseInt(cid) });
  
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
  
        cart.products = [];
  
        await cart.save();
  
        res.status(200).json({ message: 'Se eliminaron los productos', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar el carrito' });
    }
  });

router.put('/:cid/product/:pid', async (req, res) => {
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

        const productoRepetido = cart.products.find(product => product.productId.toString() === productId);

        if (productoRepetido) {
            productoRepetido.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        res.json('Producto editado');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar el producto' });
    }
});

router.post('/:cid/purchase', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await Cart.findById(cartId).populate('products.product');
  
      const productosComprar = [];
      const productosSinStock = [];
  
      for (const item of cart.products) {
        const product = item.product;
        const quantity = item.quantity;
  
        if (product.stock >= quantity) {
          product.stock -= quantity;
          productosComprar.push(product);
        } else {
          productosSinStock.push(product._id);
        }
      }
  
      if (productosComprar.length > 0) {
        const ticket = new Ticket({
          code: generateTicketCode(),
          amount: productosComprar.length,
          purchaser: req.user.email
        });
  
        await ticket.save();
        const productsToKeep = cart.products.filter(item => !productosComprar.includes(item.product));
        cart.products = productsToKeep;
        await cart.save();
  
        res.status(200).json({ ticket });
      } else {
        res.status(400).json({ message: 'No products available for purchase' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  async function generateTicketCode() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const longitudCode = 8;
    let code = '';
  
    let esUnico = false;
    while (!esUnico) {
      for (let i = 0; i < codeLength; i++) {
        const codeRandom = Math.floor(Math.random() * characters.length);
        code += characters[codeRandom];
      }
  
      const existeCodigo = await Ticket.findOne({ code });
      if (!existeCodigo) {
        esUnico = true;
      } else {
        code = '';
      }
    }
  
    return code;
  }
  

module.exports = router;