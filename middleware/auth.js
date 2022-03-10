const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;
const SauceModel = require("../models/sauce.model");

module.exports.auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      const userId = decodedToken.id;

      if (!ObjectId.isValid(userId))
        return res.status(401).json({ error: "Utilisateur inéxistant ! " });
      next()
    } else {
      res.status(401).json({ error: "Requete non autorisée ! " });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.authEdit = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.id;

    const sauce = await SauceModel.findById(req.params.id)
    if (!ObjectId.isValid(userId))
      return res
        .status(401)
        .json({ error: err || "Utilisateur inéxistant ! " });
    if (sauce.userId === userId) {
      next()
    } else {
      res.status(401).json({ error: err || "Vous ne pouvez pas modifier une sauce que vous n'avez pas créer ! " });
    }
  } else {
    console.log(err);
    res.status(401).json({ error: err || "Requete non autorisée ! " });
  }
};
