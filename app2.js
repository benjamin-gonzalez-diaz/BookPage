const express = require("express");
const cassandraClient = require("./db/connection");

const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");

// Configuración para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

app.get("/indexAll", (req, res) => {
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
// autor ------------------------------------- CRUD Listo
// Ruta para obtener un nuevo Autor
app.get("/authors", (req, res) => {
  const selectQuery = "SELECT * FROM authors";

  cassandraClient.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error("Error al obtener los autores:", err);
      res.status(500).send("Error al obtener los autores");
    } else {
      res.render("authors", { Authors: result.rows });
    }
  });
});
// Ruta para agregar un nuevo autor
app.post("/authors", (req, res) => {
  console.log(req.body);
  const authorName = req.body.nombre;
  const dateOfBirth = req.body.dateOfBirth;
  const country = req.body.country;
  const shortDescription = req.body.shortDescription;

  // Genera un ID único utilizando uuidv4()
  const authorId = Math.floor(Math.random() * 9000) + 1;

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
// Ruta para actualizar un autor
app.post("/authors/:id", (req, res) => {
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
// Ruta para eliminar un autor
app.post("/authors/:id/delete", (req, res) => {
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
// ------------------------------------------
// Libros CRUD listo------------------------------------------------------------
// Ruta para mostrar todos los libros
app.get("/books", (req, res) => {
  const selectQuery = "SELECT * FROM books";

  cassandraClient.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error("Error al obtener los libros:", err);
      res.status(500).send("Error al obtener los libros");
    } else {
      res.render("books", { books: result.rows });
    }
  });
});
// Ruta para agregar un nuevo libro
app.post("/books", (req, res) => {
  console.log(req.body);
  const bookId = Math.floor(Math.random() * 9000) + 1;
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
// Ruta para eliminar un libro
app.post("/books/:id/delete", (req, res) => {
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
// Ruta para actualizar un libro
app.post("/books/:id", (req, res) => {
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
// Reseñas CRUD listo---------------------------------------------------------------------
// Ruta para mostrar todas las reseñas
app.get("/reviews", (req, res) => {
  const selectQuery = "SELECT * FROM reviews";

  cassandraClient.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error("Error al obtener las reseñas:", err);
      res.status(500).send("Error al obtener las reseñas");
    } else {
      res.render("reviews", { reviews: result.rows });
    }
  });
});

// Ruta para agregar una nueva reseña
app.post("/reviews", (req, res) => {
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

// Ruta para eliminar una reseña
app.post("/reviews/:id/delete", (req, res) => {
  const reviewId = parseInt(req.params.id);

  const deleteQuery = "DELETE FROM reviews WHERE id = ?";

  cassandraClient.execute(deleteQuery, [reviewId], { prepare: true }, (err) => {
    if (err) {
      console.error("Error al eliminar la reseña:", err);
      res.status(500).send("Error al eliminar la reseña");
    } else {
      res.redirect("/reviews");
    }
  });
});

// Ruta para actualizar una reseña
app.post("/reviews/:id", (req, res) => {
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
// ------------------------------------------------------------
// Ventas ---------------------------------------------------------------------
// Ruta para mostrar todas las ventas por año
app.get("/salesbyyear", (req, res) => {
  const selectQuery = "SELECT * FROM salesbyyear";

  cassandraClient.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error("Error al obtener las ventas por año:", err);
      res.status(500).send("Error al obtener las ventas por año");
    } else {
      res.render("salesbyyear", { sales: result.rows });
    }
  });
});

// Ruta para agregar una nueva venta por año
app.post("/salesbyyear", (req, res) => {
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

// Ruta para eliminar una venta por año
app.post("/salesbyyear/:id/delete", (req, res) => {
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

// Ruta para actualizar una venta por año
app.post("/salesbyyear/:id", (req, res) => {
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

app.get("/authors_books", (req, res) => {
  const selectAuthorsQuery = `
 SELECT * FROM authorbooks
 `;

  // Realizar la consulta a la base de datos usando tu cassandraCliente de Cassandra
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

// Ruta para servir el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});
