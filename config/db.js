const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.uzuf3.mongodb.net/p6"
  )
  .then(() => console.log("Base de données initialisée"))
  .catch((err) => console.log(err));
