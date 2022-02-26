const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    console.log(req.body);
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      const userId = decodedToken.userId;
      if (req.body.userId !== userId) {
        throw "Utilisateur non valable";
      } else {
        next();
      }
    } else {
        throw "Vous devez être authentifié"
    }
  } catch (err) {
    res.status(401).json({ error: err || "Requete non autorisée ! " });
  }
};
