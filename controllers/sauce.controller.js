const SauceModel = require("../models/sauce.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.addSauce = async (req, res) => {
  let sauce = JSON.parse(req.body.sauce);
  let imageUrl = "./images/" + req.file.filename;
  try {
    await SauceModel.create({
      userId: sauce.userId,
      name: sauce.name,
      manufacturer: sauce.manufacturer,
      imageUrl: imageUrl,
      description: sauce.description,
      mainPepper: sauce.mainPepper,
      heat: sauce.heat,
    });
    return res.status(201).send({ message: "La sauce à bien été ajoutée" });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};

module.exports.getAllSauces = async (req, res) => {
  const sauces = await SauceModel.find();
  res.status(200).json(sauces);
};

module.exports.getSauce = async (req, res) => {
  SauceModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
  });
};

module.exports.updateSauce = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu " + req.params.id);
  try {
    let sauceToUpdate = await SauceModel.find({ _id: req.params.id });

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

    await sauceToUpdate[0].save();

    return res.status(201).send({ message: "misa à jour effectuée" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: err });
  }
};
module.exports.deleteSauce = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu " + req.params.id);

  try {
    await SauceModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).send({ message: "Supression effectuée" });
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.likeSauce = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);

  try {
    let user = req.body.userId;
    if (req.body.like === 1) {
      SauceModel.findByIdAndUpdate(
        req.params.id,
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
    if (req.body.like === -1) {
      SauceModel.findByIdAndUpdate(
        req.params.id,
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
    if (req.body.like === 0) {
      let sauceToUpdate = await SauceModel.find({ _id: req.params.id });

      if (
        sauceToUpdate[0].usersLiked.find(() => {
          user;
          return true;
        })
      ) {
        sauceToUpdate[0].usersLiked.splice(user, 1);
        sauceToUpdate[0].likes--;
        console.log(sauceToUpdate[0]);
        await sauceToUpdate[0].save();
        return res.status(200).send({ message: "Like supprimé" });
      }
      if (
        sauceToUpdate[0].usersDisliked.find(() => {
          user;
          return true;
        })
      ) {
        sauceToUpdate[0].usersDisliked.splice(user, 1);
        sauceToUpdate[0].dislikes--;
        console.log(sauceToUpdate[0]);
        await sauceToUpdate[0].save();
        return res.status(200).send({ message: "Dislike supprimé" });
      }
    }
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
};
