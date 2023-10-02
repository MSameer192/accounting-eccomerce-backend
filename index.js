const { PORT } = require("./config/env");
const express = require("express");
var bodyParser = require("body-parser");
const app = express();

// connecting db
require("./start/db");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Express Json
require("./start/json")(app);
// CORS middleware
require("./start/cors")(app);
// Express-Session
require("./start/session")(app);

// All Routes
require("./start/routes")(app);

// Test server
app.get("/", (req, res) => {
  res.send("hello world");
});

// Start Server
app.listen(PORT || 3000, () => {
  console.log(`Server is running at ${PORT}`);
});
