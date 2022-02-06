const router = require("express").Router();
const sauceController = require("../controllers/sauce.controller");
const multer = require("multer");
const path = require("path");

// Fonction de multer qui envoie l'image au dossier front et la renomme de façon a eviter les conflit de fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + "../../../front/images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      Date.now() +
        path.basename(file.originalname).replace(/[^a-zA-Z]/g, "") +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ fileSize: 2097152, storage: storage });
//Routes PUT
router.put("/:id", upload.single("image"), sauceController.updateSauce);

//Routes POST
router.post("/", upload.single("image"), sauceController.addSauce);
router.post("/:id/like", sauceController.likeSauce);

//Routes GET
router.get("/", sauceController.getAllSauces);
router.get("/:id", sauceController.getSauce);

//Route DELETE
router.delete("/:id", sauceController.deleteSauce);

module.exports = router;
