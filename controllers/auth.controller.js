const UserModel = require("../models/user.model");

module.exports.signUp = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await UserModel.create({ email, password });
    res.status(201).send("Le compte à bien été crée, veuillez vous connecter");
  } catch (err) {
    res.status(420).send({ error: err });
  }
};
