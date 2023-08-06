const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los libros y agrega libros */
router
  .route("/")
  .get((req, res) => {
    const selectAuthorsQuery = "SELECT * FROM authors";
    const selectBooksQuery = "SELECT * FROM books";
  
    // Ejecutar ambas consultas en paralelo
    Promise.all([
      cassandraClient.execute(selectAuthorsQuery, [], { prepare: true }),
      cassandraClient.execute(selectBooksQuery, [], { prepare: true }),
    ])
      .then(([authorsResult, booksResult]) => {
        res.render("books", {
          Authors: authorsResult.rows,
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
    const bookId = Math.floor(Math.random() * 9000) + 1;
    const bookName = req.body.nombre;
    const summary = req.body.summary;
    const dateOfPublication = req.body.dateOfPublication;
    const numberOfSales = parseInt(req.body.numberOfSales);
    const author = parseInt(req.body.author);

    const insertQuery =
      "INSERT INTO books (id, nombre, summary, dateOfPublication, numberOfSales, author) VALUES (?, ?, ?, ?, ?, ?)";

    cassandraClient.execute(
      insertQuery,
      [bookId, bookName, summary, dateOfPublication, numberOfSales, author],
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
