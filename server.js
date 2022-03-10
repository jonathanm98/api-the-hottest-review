const express = require("express");
const authRoutes = require("./routes/auth.routes");
const sauceRoutes = require("./routes/sauce.routes");
require("dotenv").config({ path: "./config/.env" });
const fs = require("fs");
const https = require("https");
const cert = fs.readFileSync("./config/cert/localhost.pem", "utf8");
const key = fs.readFileSync("./config/cert/localhost-key.pem", "utf8");
const credentials = { key: key, cert: cert };
const { xss } = require('express-xss-sanitizer');

require("./config/db");
const cors = require("cors");
const app = express();
const httpsServer = https.createServer(credentials, app);

// Utilisation de cors pour autoriser l'acces seulement pour l'application front
const corsOptions = {
  origin: 'http://127.0.0.1:8081'
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss())

app.use("/api/auth", authRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static("images"));


httpsServer.listen(process.env.PORT, () =>
  console.log("Serveur démarré sur le port " + process.env.PORT)
);

module.exports = app;
