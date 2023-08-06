const cassandraClient = require("../db/connection");
const { getLastId } = require("../utils");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los reviews y agrega reviews */
router
  .route("/")
  .get((req, res) => {
    const selectQuery = "SELECT * FROM reviews";

    cassandraClient.execute(selectQuery, [], (err, result) => {
      if (err) {
        console.error("Error al obtener las reseñas:", err);
        res.status(500).send("Error al obtener las reseñas");
      } else {
        res.render("reviews", { reviews: result.rows });
      }
    });
  })
  .post((req, res) => {
    console.log(req.body);
    const reviewId = getLastId(cassandraClient, "reviews") + 1;
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
  const bookId = parseInt(req.params.id);

  const deleteQuery = "DELETE FROM reviews WHERE id = ?";

  cassandraClient.execute(deleteQuery, [bookId], { prepare: true }, (err) => {
    if (err) {
      console.error("Error al eliminar el review:", err);
      res.status(500).send("Error al eliminar el review");
    } else {
      res.redirect("/reviews");
    }
  });
});

module.exports = router;
