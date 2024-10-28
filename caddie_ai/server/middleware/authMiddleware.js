const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  console.log('Auth Header:', req.header('Authorization'));
  // Get token from Authorization header
  const authHeader = req.header('Authorization');
  
  // Check if no auth header
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 
    const token = authHeader.replace('Bearer ', '');
    console.log('Token being verified:', token);
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;