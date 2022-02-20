const express = require("express");
const https = require("https");
const fs = require("fs");
const authRoutes = require("./routes/auth.routes");
const sauceRoutes = require("./routes/sauce.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const cors = require("cors");
const app = express();

// Utilisation du protocol HTTPS
const key = fs.readFileSync("./privatekey.key");
const cert = fs.readFileSync("./certificate.crt");
const server = https.createServer({ key: key, cert: cert }, app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sauces", sauceRoutes);

server.listen(process.env.PORT, () =>
  console.log("Serveur lancé sur le port " + process.env.PORT)
);

module.exports = app;
