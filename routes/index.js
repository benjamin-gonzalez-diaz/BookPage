const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
  const selectAuthorsQuery = "SELECT * FROM authors";
  const selectBooksQuery = "SELECT * FROM books";
  const selectReviewQuery = "SELECT * FROM reviews";
  const selectSalesByYearQuery = "SELECT * FROM salesbyyear";

  // Ejecutar ambas consultas en paralelo
  Promise.all([
    cassandraClient.execute(selectAuthorsQuery, [], { prepare: true }),
    cassandraClient.execute(selectBooksQuery, [], { prepare: true }),
    cassandraClient.execute(selectReviewQuery, [], { prepare: true }),
    cassandraClient.execute(selectSalesByYearQuery, [], { prepare: true }),
  ])
    .then(([authorsResult, booksResult, reviewResult, salesbyyearResult]) => {
      res.render("indexAll", {
        Authors: authorsResult.rows,
        books: booksResult.rows,
        reviews: reviewResult.rows,
        sales: salesbyyearResult.rows,
      });
    })
    .catch((err) => {
      console.error("Error al obtener datos:", err);
      res.status(500).send("Error al obtener datos");
    });
});

module.exports = router;
