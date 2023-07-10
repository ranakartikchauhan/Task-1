const express = require('express');
const cors = require('cors')
require('dotenv').config({path: './.env'});
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./db');

const app = express();
app.use(cookieParser());


app.use(cors());
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));


// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});