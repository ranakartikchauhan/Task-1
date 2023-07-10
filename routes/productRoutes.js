const express = require('express');
const router = express.Router();

const { getAllProducts, createProduct,getProduct, deleteProductById, updateProductAndDetails } = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');

// GET /products
router.get('/', authenticate, getAllProducts);

// POST /products
router.post('/create', authenticate, createProduct);
router.get('/get/:id', authenticate, getProduct);
router.delete('/delete/:id', authenticate, deleteProductById);
router.put('/update/:id', authenticate, updateProductAndDetails);

module.exports = router;