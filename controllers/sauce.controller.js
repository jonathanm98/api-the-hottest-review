const SauceModel = require("../models/sauce.model");
const fs = require("fs");

// Fonction pour le création de nouvelles sauces
module.exports.addSauce = async (req, res) => {
  console.log(req.body);
  // On récupère les infos saisies par l'utilisateur
  let sauce = JSON.parse(req.body.sauce);
  // On définis l'URL de l'image
  let imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  try {
    // On crée notre sauce
    await SauceModel.create({
      userId: sauce.userId,
      name: sauce.name,
      manufacturer: sauce.manufacturer,
      imageUrl: imageUrl,
      description: sauce.description,
      mainPepper: sauce.mainPepper,
      heat: sauce.heat,
    });
    // et on renvoie un message de succes
    return res.status(201).send({ message: "La sauce à bien été ajoutée" });
  } catch (err) {
    // Sinon on renvoie un message d'erreur
    return res.status(400).send({ message: err });
  }
};

// Fonction qui renvoie toutes les sauces de la db
module.exports.getAllSauces = async (req, res) => {
  const sauces = await SauceModel.find();
  res.status(200).json(sauces);
};

// Fonction qui renvoie une sauce spécifique
module.exports.getSauce = (req, res) => {
  SauceModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
  });
};

module.exports.updateSauce = async (req, res) => {
  try {
    // On identifie la sauce ciblée par l'utilisateur
    let sauceToUpdate = await SauceModel.find({ _id: req.params.id });

    // La requette est différente si elle contiens un fichier donc on fait un if else
    // pour traiter l'image si elle existe dans la requette
    if (req.file) {
      sauceToUpdate[0].imageUrl = "./images/" + req.file.filename;
      sauceToUpdate[0].name = JSON.parse(req.body.sauce).name;
      sauceToUpdate[0].manufacturer = JSON.parse(req.body.sauce).manufacturer;
      sauceToUpdate[0].description = JSON.parse(req.body.sauce).description;
      sauceToUpdate[0].mainPepper = JSON.parse(req.body.sauce).mainPepper;
      sauceToUpdate[0].heat = JSON.parse(req.body.sauce).heat;
    } else {
      sauceToUpdate[0].name = req.body.name;
      sauceToUpdate[0].manufacturer = req.body.manufacturer;
      sauceToUpdate[0].description = req.body.description;
      sauceToUpdate[0].mainPepper = req.body.mainPepper;
      sauceToUpdate[0].heat = req.body.heat;
    }

    // On sauvegarde notre sauce dans la db
    await sauceToUpdate[0].save();

    // Et on renvoie une message de succes à l'utilisateur
    return res.status(201).send({ message: "Mise à jour effectuée" });
  } catch (err) {
    console.log(err.message);
    return res.status(401).send({
      message:
        "Vous ne pouvez pas modifier une sauce que vous n'avez pas créer",
    });
  }
};

// Fonction qui supprime la sauce ciblée par l'utilisateur
module.exports.deleteSauce = async (req, res) => {
  SauceModel.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`./images/${filename}`, () => {
        try {
          SauceModel.deleteOne({ _id: req.params.id }).exec();
          res.status(200).send({ message: "Supression effectuée" });
        } catch (err) {
          res.status(401).send({
            message:
              "Vous ne pouvez pas supprimer une sauce que vous n'avez pas créer",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ err });
    });
};

module.exports.likeSauce = async (req, res) => {
  try {
    let user = req.body.userId;
    // Si l'attribut "like" de la requette est égal à 1 on doit ajouter un like à la sauce
    if (req.body.like === 1) {
      // On cherche la sauce avec l'id fourni dans la requete
      SauceModel.findByIdAndUpdate(
        req.params.id,
        // On ajoute l'id de l'utilisateur dans userLiked et on incrémente de 1 les likes
        {
          $addToSet: { usersLiked: user },
          $inc: { likes: 1 },
        },
        { new: true },
        (err, docs) => {
          if (!err) return res.status(200).send({ message: "Vous aimez" });
        }
      );
    }
    // Si l'attribut "like" de la requette est égal à -1 on doit ajouter un dislike à la sauce
    if (req.body.like === -1) {
      // On cherche la sauce avec l'id fourni dans la requete
      SauceModel.findByIdAndUpdate(
        req.params.id,
        // On ajoute l'id de l'utilisateur dans userLiked et on incrémente de 1 les dislikes
        {
          $addToSet: { usersDisliked: user },
          $inc: { dislikes: 1 },
        },
        { new: true },
        (err, docs) => {
          if (!err)
            return res.status(200).send({ message: "Vous n'aimez pas" });
        }
      );
    }
    // Si l'attribut "like" de la requette est égal à 0 on doit retirer le like/dislike
    if (req.body.like === 0) {
      // On cherche et on stock la sauce avec l'id fourni dans la requete
      let sauceToUpdate = await SauceModel.find({ _id: req.params.id });

      // Si on trouyve l'id de l'utilisateur dans usersLiked ...
      if (
        sauceToUpdate[0].usersLiked.find(() => {
          user;
          return true;
        })
      ) {
        //... on y retire son id ...
        sauceToUpdate[0].usersLiked.splice(user, 1);
        //... on décrémente 1 à la somme des likes ...
        sauceToUpdate[0].likes--;
        //... et enfin on sauvegarde la sauce dans la db
        await sauceToUpdate[0].save();
        return res.status(201).send({ message: "Like supprimé" });
      }
      // Si on trouyve l'id de l'utilisateur dans usersDisliked ...
      if (
        sauceToUpdate[0].usersDisliked.find(() => {
          user;
          return true;
        })
      ) {
        //... on y retire son id ...
        sauceToUpdate[0].usersDisliked.splice(user, 1);
        //... on décrémente 1 à la somme des likes ...
        sauceToUpdate[0].dislikes--;
        //... et enfin on sauvegarde la sauce dans la db
        await sauceToUpdate[0].save();
        return res.status(201).send({ message: "Dislike supprimé" });
      }
    }
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};
