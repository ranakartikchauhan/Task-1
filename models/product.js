const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String,  required: [true, 'Name is required'], },
  price: { type: Number,  required: [true, 'Price is required'], },
  stockQty: { type: Number,  required: [true, 'Stock quantity is required'], },
  stockConsumed: { type: Number,  required: [true, 'Stock Consumed is required'], },
  productDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductDetails',
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
