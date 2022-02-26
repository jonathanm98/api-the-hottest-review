const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// Fonction d'authentification qui crée un token signé qui expire sous 24h
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN, {
    expiresIn: "24h",
  });
};

// Fonction d'inscription
module.exports.signUp = async (req, res) => {
  // On stocke les infos saisies par l'utilisateur
  const { email, password } = req.body;
  try {
    // On essaye de créer l'utilisateur
    await UserModel.create({ email, password });
    // et on renvoie un message qui indique que tout c'est bien déroulé
    res
      .status(201)
      .send({ message: "Le compte à bien été crée, veuillez vous connecter" });
  } catch (err) {
    // Si jamais l'email saisi par l'utilisateur existe dejà dans la db on renvoie une erreur
    res.status(400).send({ message: "Un compte existe déjà avec cet email" });
  }
};

// Fonction de connection
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // On vérifie si les login que l'utilisateur envoie existent dans notre base de données
    const user = await UserModel.login(email, password);
    // On crée un token qu'on renvoie à l'utilisateur ainsi que son id
    const token = createToken(user._id);
    res.status(200).json({ token: token, userId: user._id });
  } catch (err) {
    // Sinon on renvoie une erreur
    console.log(err.message);
    res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }
};
