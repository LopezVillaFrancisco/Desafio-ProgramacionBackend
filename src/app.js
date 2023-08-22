const express = require('express');
const ProductManager = require('./productManager'); 

const app = express();

const postProduct = new ProductManager();

postProduct.addProduct('Producto prueba 1','Este producto es una prueba',200,'Sin imagen','abc123',25) 
postProduct.addProduct('Producto prueba 2','Este producto es una prueba',210,'Sin imagen','abc124',30) 
postProduct.addProduct('Producto prueba 3','Este producto es una prueba',290,'Sin imagen','abc125',40)
postProduct.addProduct('Producto prueba 4','Este producto es una prueba',393,'Sin imagen','abc126',21)
postProduct.addProduct('Producto prueba 5','Este producto es una prueba',790,'Sin imagen','abc127',22)
postProduct.addProduct('Producto prueba 6','Este producto es una prueba',690,'Sin imagen','abc128',27)
postProduct.addProduct('Producto prueba 7','Este producto es una prueba',599,'Sin imagen','abc129',12)
postProduct.addProduct('Producto prueba 8','Este producto es una prueba',594,'Sin imagen','abc131',55)
postProduct.addProduct('Producto prueba 9','Este producto es una prueba',684,'Sin imagen','abc132',45)
postProduct.addProduct('Producto prueba 10','Este producto es una prueba',884,'Sin imagen','abc134',35)


app.get('/products', (req, res) => {
    const limit = parseInt(req.query.limit);
    if (limit) {
        let productoslimit = postProduct.products.slice(0, limit);
        res.send(`Los ${limit} primeros productos: ${JSON.stringify(productoslimit)}`);
    } else {
        res.send(`Productos: ${JSON.stringify(postProduct.products)}`);
    }
});


app.get('/products/:idUsuario', (req, res) => { 
    const idUsuario = parseInt(req.params.idUsuario);
    const producto = postProduct.getProductById(idUsuario);
    
    if (producto) {
        res.send(`El producto con ID ${idUsuario} es: ${JSON.stringify(producto)}`);
    } else {
        res.send(`No se encontró ningún producto con ID ${idUsuario}`);
    }
});

app.listen(8080, () => console.log('Servidor en línea en el puerto 8080'));
