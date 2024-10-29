const jwt = require("jsonwebtoken");

const blacklist = [];

const verifyToken = (token) => {
  if (blacklist.includes(token)) {
    throw new Error("Token inválido");
  }
  return jwt.verify(token, process.env.SECRET_JWT);
};

const blackListToken = (token) => {
  blacklist.push(token);
};

function autenticarToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const user = verifyToken(token); 
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = {
  autenticarToken,
  blackListToken,
  verifyToken,
};
