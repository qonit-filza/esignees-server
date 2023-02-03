const jwt = require("jsonwebtoken");
const secret = "rahasia"

const createToken = (payload) => {
  return jwt.sign(payload, secret);
};

const decodedToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { createToken, decodedToken };