const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Check if jwt token is valid
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user.dataValues) {
        req.loggedIn = { ...user.dataValues, password: "" };
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no JWT" });
  }
};

module.exports = protect;
