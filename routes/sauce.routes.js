const router = require("express").Router();
const sauceController = require("../controllers/sauce.controller");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + "../../../front/images");
  },
  filename: (req, file, callback) => {
    console.log(file);
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), sauceController.addSauce);
router.get("/", sauceController.getAllSauces);

router.get("/:id", sauceController.getSauce);
router.put("/:id", sauceController.updateSauce);
router.post("/:id/like", sauceController.likeSauce);
router.delete("/:id", sauceController.deleteSauce);

module.exports = router;
