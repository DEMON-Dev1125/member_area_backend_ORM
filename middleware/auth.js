const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

isAuthenticated = (req, res, next) => {
  let authorizationHeader = req.headers["authorization"];
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    });
  } else {
    res.status(403).json({ message: "No token provided" });
  }
};

const auth = {
  isAuthenticated: isAuthenticated,
};
module.exports = auth;
