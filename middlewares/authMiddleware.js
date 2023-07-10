const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {

  const token = req.cookies.authToken; // Get the token from the "authToken" cookie
  if (!token) {
    return res.status(401).json({ message: 'Authorization token not provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};


module.exports = authenticate;