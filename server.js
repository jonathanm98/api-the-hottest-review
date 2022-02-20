const express = require("express");
const authRoutes = require("./routes/auth.routes");
const sauceRoutes = require("./routes/sauce.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const cors = require("cors");
const app = express();

// Utilisation de cors pour autoriser l'acces seulement pour l'application front (localhost:8081)
app.use(
  cors({
    origin: "http://127.0.0.1:8081",
    methods: "GET,PUT,POST,DELETE",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sauces", sauceRoutes);

app.listen(process.env.PORT, () =>
  console.log("Serveur lancé sur le port " + process.env.PORT)
);

module.exports = app;
