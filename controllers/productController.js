const Product = require('../models/product');
const ProductDetails = require('../models/productDetails');

// Get all products with details
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('productDetails');
    res.json(products);
  } catch (err) {
    // Handle the error
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const productDetails = {
    "mfgName": req.body.mfgName,
    "mfgAddress": req.body.mfgAddress
  }
  const product = {
    "name": req.body.name,
    "stockQty": req.body.stockQty,
    "price": req.body.price,
    "stockConsumed": req.body.stockConsumed

  }
  try {

    // Create a new product
    const productSaved = new Product(product);

    // Save the product to the database
    await productSaved.save();

    // Create a new product details
    productDetails.productId = productSaved._id
    const productDetailsSaved = new ProductDetails(productDetails);

    // Save the product details to the database
    await productDetailsSaved.save();

    // Update the product with the product details reference
    productSaved.productDetails = productDetailsSaved._id;
    await productSaved.save();

    res.status(201).json({
      message: 'Product created with product details successfully',
      product,
      productDetails,
    });
  } catch (error) {
    console.error('Error creating product with product details:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getProduct = async (req, res) => {
  var productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate('productDetails');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

const deleteProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (deletedProduct) {
      // Find the associated product details and delete them
      await ProductDetails.findOneAndDelete({ productId: productId });
      res.json({ message: 'Product and its details deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product and its details:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

const updateProductAndDetails = async (req, res) => {
  const productId = req.params.id;

  const productDetailsUpdates = {
    "mfgName": req.body.mfgName,
    "mfgAddress": req.body.mfgAddress
  }
  const productUpdates = {
    "name": req.body.name,
    "stockQty": req.body.stockQty,
    "price": req.body.price,
    "stockConsumed": req.body.stockConsumed

  }

  try {
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productUpdates,

    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product details
    const updatedProductDetails = await ProductDetails.findOneAndUpdate(
      { productId: productId },
      productDetailsUpdates,
      { new: true }
    );

    if (!updatedProductDetails) {
      return res.status(404).json({ error: 'Product details not found' });
    }

    res.json({
      message: 'Product and its details updated successfully',
      updatedProduct,
      updatedProductDetails,
    });
  } catch (error) {
    console.error('Error updating product and its details:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { getAllProducts, createProduct, getProduct, deleteProductById, updateProductAndDetails };