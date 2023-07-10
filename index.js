const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('./db');

const app = express();
app.use(cookieParser());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Start the server
const port = 7000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});