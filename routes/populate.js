const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();
const { populateData } = require("../db/populate");

router.get("/", (req, res) => {
  populateData(cassandraClient);
  res.redirect("/");
});

module.exports = router;
