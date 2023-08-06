const cassandraClient = require("../db/connection");
const { getLastId } = require("../utils");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los libros y agrega libros */
router
  .route("/")
  .get((req, res) => {
    const selectQuery = "SELECT * FROM books";

    cassandraClient.execute(selectQuery, [], (err, result) => {
      if (err) {
        console.error("Error al obtener los libros:", err);
        res.status(500).send("Error al obtener los libros");
      } else {
        res.render("books", { books: result.rows });
      }
    });
  })
  .post((req, res) => {
    console.log(req.body);
    const bookId = getLastId(cassandraClient, "books") + 1;
    const bookName = req.body.nombre;
    const summary = req.body.summary;
    const dateOfPublication = req.body.dateOfPublication;
    const numberOfSales = parseInt(req.body.numberOfSales);

    const insertQuery =
      "INSERT INTO books (id, nombre, summary, dateOfPublication, numberOfSales) VALUES (?, ?, ?, ?, ?)";

    cassandraClient.execute(
      insertQuery,
      [bookId, bookName, summary, dateOfPublication, numberOfSales],
      { prepare: true },
      (err) => {
        if (err) {
          console.error("Error al agregar el libro:", err);
          res.status(500).send("Error al agregar el libro");
        } else {
          res.redirect("/books");
        }
      }
    );
  });

/**Este router agarra un libro individual y lo actualiza */
router.route("/:id").post((req, res) => {
  const bookId = parseInt(req.params.id);
  const bookName = req.body.nombre;
  const summary = req.body.summary;
  const dateOfPublication = req.body.dateOfPublication;
  const numberOfSales = parseInt(req.body.numberOfSales);

  const updateQuery =
    "UPDATE books SET nombre = ?, summary = ?, dateOfPublication = ?, numberOfSales = ? WHERE id = ?";

  cassandraClient.execute(
    updateQuery,
    [bookName, summary, dateOfPublication, numberOfSales, bookId],
    { prepare: true },
    (err) => {
      if (err) {
        console.error("Error al actualizar el libro:", err);
        res.status(500).send("Error al actualizar el libro");
      } else {
        res.redirect("/books");
      }
    }
  );
});

/**Este router elimina un libro */
router.route("/:id/delete").post((req, res) => {
  const bookId = parseInt(req.params.id);

  const deleteQuery = "DELETE FROM books WHERE id = ?";

  cassandraClient.execute(deleteQuery, [bookId], { prepare: true }, (err) => {
    if (err) {
      console.error("Error al eliminar el libro:", err);
      res.status(500).send("Error al eliminar el libro");
    } else {
      res.redirect("/books");
    }
  });
});

module.exports = router;
