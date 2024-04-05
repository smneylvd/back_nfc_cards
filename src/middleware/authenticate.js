// Middleware for authentication
const jwt = require('jsonwebtoken');
const send = require("../transformers/message");
require('dotenv').config();

function authenticate(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return send(res, 401);

  try {
    const jwtPrivateKey = process.env.JWT_KEY;
    if (!jwtPrivateKey) {
      return send(res, 500, 'Set JWT_KEY in env');
    }
    req.user = jwt.verify(token, jwtPrivateKey);
    next();
  } catch (error) {
    return send(res, 401);
  }
}

module.exports = {
  authenticate
};
