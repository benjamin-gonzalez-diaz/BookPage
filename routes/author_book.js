const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los autores con sus libros*/
router.route("/").get((req, res) => {
  const selectAuthorsQuery = `SELECT * FROM authorbooks`;
  cassandraClient.execute(
    selectAuthorsQuery,
    [],
    { prepare: true },
    (err, result) => {
      if (err) {
        console.error("Error al obtener los datos de autores y libros:", err);
        // Manejar el error si es necesario
        res.render("error", {
          message: "Error al obtener los datos de autores y libros",
        });
      } else {
        // Pasar los resultados obtenidos a la vista
        const authorsBooks = result.rows;
        res.render("authors_books", { authorsBooks });
      }
    }
  );
});

module.exports = router;
