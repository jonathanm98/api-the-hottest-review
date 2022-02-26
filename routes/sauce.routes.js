const router = require("express").Router();
const sauceController = require("../controllers/sauce.controller");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

// Fonction de multer qui envoie l'image au dossier front et la renomme de façon a eviter les conflit de fichiers
const mimetypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[^a-zA-Z]/g, "");
    const ext = mimetypes[file.mimetype];
    callback(null, name + Date.now() + "." + ext);
  },
});
const upload = multer({ fileSize: 2097152, storage: storage });

//Routes PUT
router.put("/:id", auth, upload.single("image"), sauceController.updateSauce);

//Routes POST
router.post("/", auth, upload.single("image"), sauceController.addSauce);
router.post("/:id/like", auth, sauceController.likeSauce);

//Routes GET
router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getSauce);

//Route DELETE
router.delete("/:id", auth, sauceController.deleteSauce);

module.exports = router;
