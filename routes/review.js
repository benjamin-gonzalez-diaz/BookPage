const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los reviews y agrega reviews */
router
  .route("/")
  .get((req, res) => {
    const selectBooksQuery = "SELECT * FROM books";
    const selectReviewQuery = "SELECT * FROM reviews";
  
    // Ejecutar ambas consultas en paralelo
    Promise.all([
      cassandraClient.execute(selectReviewQuery, [], { prepare: true }),
      cassandraClient.execute(selectBooksQuery, [], { prepare: true }),
    ])
      .then(([reviewResult, booksResult]) => {
        res.render("reviews", {
          reviews: reviewResult.rows,
          books: booksResult.rows,
        });
      })
      .catch((err) => {
        console.error("Error al obtener datos:", err);
        res.status(500).send("Error al obtener datos");
      });
  })
  .post((req, res) => {
    console.log(req.body);
    const reviewId = Math.floor(Math.random() * 9000) + 1;
    const book = req.body.book;
    const review = req.body.review;
    const score = parseInt(req.body.score);
    const numberOfVotes = parseInt(req.body.numberOfVotes);

    const insertQuery =
      "INSERT INTO reviews (id, book, review, score, numberOfVotes) VALUES (?, ?, ?, ?, ?)";

    cassandraClient.execute(
      insertQuery,
      [reviewId, book, review, score, numberOfVotes],
      { prepare: true },
      (err) => {
        if (err) {
          console.error("Error al agregar la reseña:", err);
          res.status(500).send("Error al agregar la reseña");
        } else {
          res.redirect("/reviews");
        }
      }
    );
  });

/**Este router agarra un review individual y lo actualiza */
router.route("/:id").post((req, res) => {
  const reviewId = parseInt(req.params.id);
  const book = req.body.book;
  const review = req.body.review;
  const score = parseInt(req.body.score);
  const numberOfVotes = parseInt(req.body.numberOfVotes);

  const updateQuery =
    "UPDATE reviews SET book = ?, review = ?, score = ?, numberOfVotes = ? WHERE id = ?";

  cassandraClient.execute(
    updateQuery,
    [book, review, score, numberOfVotes, reviewId],
    { prepare: true },
    (err) => {
      if (err) {
        console.error("Error al actualizar la reseña:", err);
        res.status(500).send("Error al actualizar la reseña");
      } else {
        res.redirect("/reviews");
      }
    }
  );
});

/**Este router elimina un review */
router.route("/:id/delete").post((req, res) => {
  
  const reviewId = req.params.id;
  const deleteQuery = "DELETE FROM reviews WHERE id = ?";

  cassandraClient.execute(deleteQuery, [reviewId], { prepare: true }, (err) => {
    if (err) {
      console.error("Error al eliminar el review:", err);
      res.status(500).send("Error al eliminar el review");
    } else {
      res.redirect("/reviews");
    }
  });
});

module.exports = router;
