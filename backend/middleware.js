const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

// Define the authentication middleware function
const authMiddleware = (req, res, next) => {
  // Check if Authorization header exists
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ error: 'Authorization header is missing' });
  }

  // Check if Authorization header starts with 'Bearer '
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Bearer token is missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userId) {
        req.userId = decoded.userId;
        next();
    } else {
        return res.status(403).json({});
    }
  } catch (error) {
        return res.status(403).json({error})
  }
};

module.exports = { authMiddleware };
