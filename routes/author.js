const cassandraClient = require("../db/connection");
const { getLastId } = require("../utils");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los autores y agrega autores */
router
  .route("/")
  .get((req, res) => {
    const selectQuery = "SELECT * FROM authors";

    cassandraClient.execute(selectQuery, [], (err, result) => {
      if (err) {
        console.error("Error al obtener los autores:", err);
        res.status(500).send("Error al obtener los autores");
      } else {
        res.render("authors", { Authors: result.rows });
      }
    });
  })
  .post((req, res) => {
    console.log(req.body);
    const authorName = req.body.nombre;
    const dateOfBirth = req.body.dateOfBirth;
    const country = req.body.country;
    const shortDescription = req.body.shortDescription;

    const authorId = getLastId(cassandraClient, "authors") + 1;

    const insertQuery =
      "INSERT INTO authors (id, nombre, dateOfBirth, country, shortDescription) VALUES (?, ?, ?, ?, ?)";

    cassandraClient.execute(
      insertQuery,
      [authorId, authorName, dateOfBirth, country, shortDescription],
      { prepare: true },
      (err) => {
        if (err) {
          console.error("Error al agregar el autor:", err);
          res.status(500).send("Error al agregar el autor");
        } else {
          res.redirect("/authors");
        }
      }
    );
  });

/**Este router agarra un autor individual y lo actualiza */
router.route("/:id").post((req, res) => {
  const authorId = req.params.id;
  const { nombre, dateOfBirth, country, shortDescription } = req.body;
  const updateQuery =
    "UPDATE authors SET nombre = ?, dateOfBirth = ?, country = ?, shortDescription = ? WHERE id = ?";

  cassandraClient.execute(
    updateQuery,
    [nombre, dateOfBirth, country, shortDescription, authorId],
    { prepare: true },
    (err) => {
      if (err) {
        console.error("Error al actualizar el autor:", err);
        res.status(500).send("Error al actualizar el autor");
      } else {
        res.redirect("/authors");
      }
    }
  );
});

/**Este router elimina un autor */
router.route("/:id/delete").post((req, res) => {
  const authorId = req.params.id;
  const deleteQuery = "DELETE FROM authors WHERE id = ?";

  cassandraClient.execute(
    deleteQuery,
    [parseInt(authorId)],
    { prepare: true },
    (err) => {
      if (err) {
        console.error("Error al eliminar el autor:", err);
        res.status(500).send("Error al eliminar el autor");
      } else {
        res.redirect("/authors");
      }
    }
  );
});

module.exports = router;
