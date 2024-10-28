const jwt = require("jsonwebtoken");

function autenticarToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT); 
    console.log('DECODED: ', decoded.id);
    req.userId = decoded.id;
    console.log('REQ.USERID: ', req.userId);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = {
  autenticarToken,
};
