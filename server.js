const express = require("express");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log("Serveur lancé sur le port " + process.env.PORT)
);

module.exports = app;
