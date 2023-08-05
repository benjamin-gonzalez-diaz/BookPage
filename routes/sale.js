const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

/**Este router obtiene TODOS los ventas por años y agrega ventas por años */
router
  .route("/")
  .get((req, res) => {
    const selectQuery = "SELECT * FROM salesbyyear";

    cassandraClient.execute(selectQuery, [], (err, result) => {
      if (err) {
        console.error("Error al obtener las ventas por año:", err);
        res.status(500).send("Error al obtener las ventas por año");
      } else {
        res.render("salesbyyear", { sales: result.rows });
      }
    });
  })
  .post((req, res) => {
    console.log(req.body);
    const saleId = Math.floor(Math.random() * 9000) + 1;
    const book = req.body.book;
    const year = req.body.year;
    const sales = parseInt(req.body.sales);

    const insertQuery =
      "INSERT INTO salesbyyear (id, book, year, sales) VALUES (?, ?, ?, ?)";

    cassandraClient.execute(
      insertQuery,
      [saleId, book, year, sales],
      { prepare: true },
      (err) => {
        if (err) {
          console.error("Error al agregar la venta por año:", err);
          res.status(500).send("Error al agregar la venta por año");
        } else {
          res.redirect("/salesbyyear");
        }
      }
    );
  });

/**Este router agarra un venta por año individual y lo actualiza */
router.route("/:id").post((req, res) => {
  const saleId = parseInt(req.params.id);
  const book = req.body.book;
  const year = req.body.year;
  const sales = parseInt(req.body.sales);

  const updateQuery =
    "UPDATE salesbyyear SET book = ?, year = ?, sales = ? WHERE id = ?";

  cassandraClient.execute(
    updateQuery,
    [book, year, sales, saleId],
    { prepare: true },
    (err) => {
      if (err) {
        console.error("Error al actualizar la venta por año:", err);
        res.status(500).send("Error al actualizar la venta por año");
      } else {
        res.redirect("/salesbyyear");
      }
    }
  );
});

/**Este router elimina un ventas por año */
router.route("/:id/delete").post((req, res) => {
  const saleId = parseInt(req.params.id);

  const deleteQuery = "DELETE FROM salesbyyear WHERE id = ?";

  cassandraClient.execute(deleteQuery, [saleId], { prepare: true }, (err) => {
    if (err) {
      console.error("Error al eliminar la venta por año:", err);
      res.status(500).send("Error al eliminar la venta por año");
    } else {
      res.redirect("/salesbyyear");
    }
  });
});

module.exports = router;
