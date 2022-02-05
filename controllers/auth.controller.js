const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: 1 * 24 * 60 * 60 * 1000,
  });
};

module.exports.signUp = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    await UserModel.create({ email, password });
    console.log(`Utilisateur ${email} créer`);

    res
      .status(201)
      .send({ message: "Le compte à bien été crée, veuillez vous connecter" });
  } catch (err) {
    res
      .status(400)
      .send({ message: "Vous possedez déjà un compte avec cet email" });
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    console.log(`Utilisateur ${email} connecté`);
    res.status(200).json({ token: token, userId: user._id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};
