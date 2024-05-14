const jwt = require("jsonwebtoken");

// Middleware to verify JWT token for the orders
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Unauthorized' });
  }
};

/** 
 * Checks for user w/ admin priviledges
 * pair w/ verifyToken to achieve intended security benefits 
 * */
const requireAdmin = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: 'Not authorized for Admin priviledges' });
};

module.exports = { verifyToken, requireAdmin }