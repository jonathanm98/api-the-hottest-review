const SauceModel = require("../models/sauce.model");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.addSauce = async (req, res) => {
  let sauce = JSON.parse(req.body.sauce);
  console.log(sauce.name);
  console.log(1);
  let imageUrl = "../../../front/images" + req.file.filename;
  console.log(2);
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
    console.log(3);
    return res.status(201).send({ message: "La sauce à bien été ajoutée" });
  } catch (err) {
    console.log(4);
    res.status(400).send({ error: err });
  }
};

module.exports.getAllSauces = async (req, res) => {
  const sauces = await SauceModel.find();
  res.status(200).json(sauces);
};

module.exports.getSauce = async (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu " + req.params.id);

  SauceModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID inconnu " + err);
  });
};

module.exports.updateSauce = (req, res) => {
  if (!ObjectId.isValid(req.params.id))
    return res.status(400).send("ID inconnu " + req.params.id);

  try {
    SauceModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          manufacturer: req.body.manufacturer,
          description: req.body.description,
          mainPepper: req.body.mainPepper,
          imageUrl: req.body.imageUrl,
          heat: req.body.heat,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(400).send({ message: err });
      }
    );
  } catch (err) {
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

  let user = req.body.userId;
  console.log(req.body);
  try {
    if (req.body.like === 1) {
      console.log("like");
      await SauceModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { usersLiked: user },
          $inc: { likes: 1 },
        },
        { new: true },
        (err, docs) => {
          console.log("1");
          if (err) return res.status(500).json({ message: err });
          if (!err) return res.status(200).send({ message: "Vous aimez" });
        }
      );
    } else if (req.body.like === 0) {
      console.log("unlike");
      await SauceModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { usersLiked: user },
          $pull: { usersDisliked: user },
          $inc: { likes: -1 },
        },
        { new: true },
        (err, docs) => {
          console.log("2");
          if (err) return res.status(500).send({ message: err });
          if (!err)
            return res.status(200).send({ message: "Vous n'aimez plus" });
        }
      );
    } else if (req.body.like === -1) {
      console.log("dislike");
      await SauceModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { usersDisiked: user },
          $inc: { dislikes: 1 },
        },
        { new: true },
        (err, docs) => {
          console.log("3");
          if (err) return res.status(500).send({ message: err });
          if (!err)
            return res.status(200).send({ message: "Vous n'aimez pas" });
        }
      );
    }
  } catch (err) {
    console.log(err);
    // return res.status(400).send({ message: err });
  }
};
