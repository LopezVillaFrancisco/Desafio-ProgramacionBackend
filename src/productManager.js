const fs = require('fs');
class ProductManager{
    constructor (){
        this.path='./src/archivoProductos.txt';
        this.products=[]
    }

    addProduct(title,description,price,thumbnail,code,stock){
        let newProduct ={
            title:title,
            description:description,
            price:price,
            thumbnail:thumbnail,
            code:code,
            stock:stock 
        }
        if(this.products.length===0){
            newProduct.id=1
        }else{
            newProduct.id=this.products.length+1;
        }

        for (let index = 0; index < this.products.length; index++) {
            if(code===this.products[index].code){
                return console.log(`Error el producto ${title} no se pudo agregar porque se repite el code`)
                
            }
            
        }
        this.products.push(newProduct) 
        fs.writeFileSync(this.path,JSON.stringify(this.products))
    }
    

    getProducts(){
        let archivoProductos = fs.readFileSync(this.path,'utf-8')
        return archivoProductos
    }


    getProductById(idFind) {
        const productId = parseInt(idFind);
        const product = this.products.find(prod => prod.id === productId);

        if (!product) {
            console.log(`Error, el producto con id ${idFind} no existe`);
            return null;
        }

        return product;
    }

    updateProduct(idFind, campoCambiar,valorCambiar){
         let productId = this.products.findIndex(prod => prod.id===idFind) 
        
        if (productId=== -1){
            console.log(`Error, el producto con id ${idFind} no existe`) 
            return
        }
        
        if(!this.products[productId].hasOwnProperty(campoCambiar)){
            return console.log(`first campo ${campoCambiar} no existe`)
        } 
        this.products[productId][campoCambiar] = valorCambiar; 
        fs.writeFileSync(this.path,JSON.stringify(this.products))
        return console.log(`el campo ${campoCambiar} del producto con id ${idFind} fue cambiado a ${valorCambiar}`) 
    }

    deleteProduct(idFind){
         let productId = this.products.findIndex(prod => prod.id===idFind) 
        
         
        if (productId=== -1){
            console.log(`Error, el producto con id ${idFind} no existe`) 
            return
        } 

        this.products.splice(productId,1)
        console.log(`El producto con id ${idFind} fue eliminado`) 
        fs.writeFileSync(this.path,JSON.stringify(this.products))
    }
} 
postProduct = new ProductManager();  

module.exports = ProductManager
