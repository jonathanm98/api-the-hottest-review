const express = require("express");
const authRoutes = require("./routes/auth.routes");
const sauceRoutes = require("./routes/sauce.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const cors = require("cors");
const app = express();

// Utilisation de cors pour autoriser l'acces seulement pour l'application front (localhost:8081)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sauces", sauceRoutes);
app.use('/images', express.static('images'));

app.listen(process.env.PORT, () =>
  console.log("Serveur lancé sur le port " + process.env.PORT)
);

module.exports = app;
