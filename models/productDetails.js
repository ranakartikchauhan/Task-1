const mongoose = require('mongoose');

const productDetailsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  mfgName: { type: String, required: true },
  mfgAddress: { type: String, required: true },
});

const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);

module.exports = ProductDetails;