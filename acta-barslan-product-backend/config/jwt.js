const jwt = require("jsonwebtoken");

const JWT_SECRET =
   process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

const generateToken = (payload) => {
   return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
   });
};

const verifyToken = (token) => {
   return jwt.verify(token, JWT_SECRET);
};

module.exports = {
   generateToken,
   verifyToken,
   JWT_SECRET,
   JWT_EXPIRE,
};
