const { Schema, model } = require("mongoose");

const cartsColl = 'carts';

const cartsSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity: Number,
        },
    ],
});

module.exports =  cartModel = model(cartsColl, cartsSchema);