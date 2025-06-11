const jwt = require("jsonwebtoken");

const adminValidate = (req, res, next) => {
let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);



    req.admin = {
      _id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
}
module.exports = adminValidate;