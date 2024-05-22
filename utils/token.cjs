// admin token
const jwt = require("jsonwebtoken");

const signToken = ({ id, isAdmin }) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { signToken };
