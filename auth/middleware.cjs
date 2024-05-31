const jwt = require('jsonwebtoken');
require("dotenv").config();

// Middleware to verify JWT token for the orders
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token){
    return res.status(403).send({message: 'No token provided'});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err){
      return res.status(500).send({message: 'Failed to authenticate token'});
    }
    req.user = decoded;
    next();
  })
};

/** 
 Checks for user w/ admin privileges pair w/ 
 verifyToken to achieve intended security benefits 
**/
const requireAdmin = (req, res, next) => {
  if (!req.user?.isadmin) {
    return res.status(403).send({ message: 'Requires admin role' });
  }
  next();
};


module.exports = { 
  verifyToken, 
  requireAdmin
}