// const y librerias ------------------

const express = require('express');
const cassandra = require('cassandra-driver');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

// ------------------------------------

// coneccion con cassandra -----------------
// Configuración para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));


// Configura la conexión a Cassandra
const client = new cassandra.Client({ 
  contactPoints: ['localhost'], 
  localDataCenter: 'datacenter1', 
  keyspace: 'mi_keyspace'
});
client.connect((err) => {
  if (err) {
    console.error('Error al conectar a Cassandra:', err);
  } else {
    console.log('Conexión a Cassandra establecida');
  }
});

// Crea el keyspace si no existe
const createKeyspaceQuery = `
  CREATE KEYSPACE IF NOT EXISTS mi_keyspace
  WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  }
`;

client.execute(createKeyspaceQuery, (err) => {
  if (err) {
    console.error('Error al crear el keyspace:', err);
  } else {
    console.log('Keyspace creado o ya existente');
  }
});
// ------------------------------
// Crear Tablas ----------------------------------------
// Crea la tabla "usuarios" si no existe en el keyspace
const createTableQueryUsuarios = `
  CREATE TABLE IF NOT EXISTS mi_keyspace.usuarios (
    id UUID PRIMARY KEY,
    nombre TEXT,
    email TEXT
  )
`;

const createTableQueryUsuarios2 = `
  CREATE TABLE IF NOT EXISTS mi_keyspace.usuarios2 (
    id int PRIMARY KEY,
    nombre TEXT
  )
`;


const createTableQueryAuthors = `
CREATE TABLE IF NOT EXISTS mi_keyspace.authors (
  id int PRIMARY KEY,
  nombre TEXT,
  dateOfBirth TEXT,
  country TEXT,
  shortDescription TEXT
)
`;

const createTableQueryBooks = `
CREATE TABLE IF NOT EXISTS mi_keyspace.books (
  id int PRIMARY KEY,
  nombre TEXT,
  summary TEXT,
  dateOfPublication TEXT,
  numberOfSales int
)
`;

const createTableQueryReviews = `
CREATE TABLE IF NOT EXISTS mi_keyspace.reviews (
  id int PRIMARY KEY,
  book TEXT,
  review TEXT,
  score int,
  numberOfVotes int
)
`;

const createTableQuerySalesByYear= `
CREATE TABLE IF NOT EXISTS mi_keyspace.salesbyyear (
  id int PRIMARY KEY,
  book TEXT,
  year TEXT,
  sales int
)
`;

const createTableAuthorsXBooks= `
CREATE TABLE IF NOT EXISTS mi_keyspace.authorsxbooks (
  id int PRIMARY KEY,
  id_Authors int,
  id_books int,
)
`;
// ----------------------------------------------
// coneccion con tablas --------------------------
client.execute(createTableQueryUsuarios, (err) => {
  if (err) {
    console.error('Error al crear la tabla usuarios:', err);
  } else {
    console.log('Tabla usuarios creada o ya existente');
    // Ahora ejecutas el query para la segunda tabla
    client.execute(createTableQueryUsuarios2, (err) => {
      if (err) {
        console.error('Error al crear la tabla usuarios2:', err);
      } else {
        console.log('Tabla usuarios2 creada o ya existente');
      }
    })
   
    // Ahora ejecutas el query para la segunda tabla
    client.execute(createTableQueryBooks, (err) => {
      if (err) {
        console.error('Error al crear la tabla books:', err);
      } else {
        console.log('Tabla books creada o ya existente');
      }
    });
  // Ahora ejecutas el query para la segunda tabla
    client.execute(createTableQueryAuthors, (err) => {
      if (err) {
        console.error('Error al crear la tabla Autores:', err);
      } else {
        console.log('Tabla Autores creada o ya existente');
      }
    });
    client.execute(createTableQueryReviews, (err) => {
      if (err) {
        console.error('Error al crear la tabla Reviews:', err);
      } else {
        console.log('Tabla Review creada o ya existente');
      }
    });
    client.execute(createTableQuerySalesByYear, (err) => {
      if (err) {
        console.error('Error al crear la tabla Sales_By_Year:', err);
      } else {
        console.log('Tabla Sales_By_Year creada o ya existente');
      }
    });
  }
});

// -------------------------------------------
// Get y Post -------------------------------------
// Ruta para crear un nuevo usuario (Ejemplo)
// app.post('/usuarios2', (req, res) => {
//   const { id, nombre } = req.body;

//   const insertQuery = `
//     INSERT INTO usuarios2 (id, nombre)
//     VALUES (?, ?)
//   `;

//   client.execute(insertQuery, [id, nombre], { prepare: true }, (err) => {
//     if (err) {
//       console.error('Error al crear el usuario:', err);
//       res.status(500).send('Error al crear el usuario');
//     } else {
//       console.log('Usuario creado exitosamente');
//       res.status(201).send('Usuario creado exitosamente');
//     }
//   });
// });
// CRUD EJEMPLO
// Ruta para mostrar todos los usuarios
app.get('/usuarios2', (req, res) => {
  const selectQuery = 'SELECT * FROM mi_keyspace.usuarios2';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).send('Error al obtener los usuarios');
    } else {
      res.render('usuarios2', { usuarios: result.rows });
    }
  });
});

// Ruta para agregar un nuevo usuario
app.post('/usuarios2', (req, res) => {
  const { id, nombre } = req.body;
  const insertQuery = 'INSERT INTO mi_keyspace.usuarios2 (id, nombre) VALUES (?, ?)';

  client.execute(insertQuery, [id, nombre], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al agregar el usuario:', err);
      res.status(500).send('Error al agregar el usuario');
    } else {
      res.redirect('/usuarios2');
    }
  });
});

// Ruta para actualizar un usuario
app.post('/usuarios2/:id', (req, res) => {
  const userId = req.params.id;
  const { nombre } = req.body;
  const updateQuery = 'UPDATE mi_keyspace.usuarios2 SET nombre = ? WHERE id = ?';

  client.execute(updateQuery, [nombre, userId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      res.status(500).send('Error al actualizar el usuario');
    } else {
      res.redirect('/usuarios2');
    }
  });
});

// Ruta para eliminar un usuario
app.post('/usuarios2/:id/delete', (req, res) => {
  const userId = req.params.id;
  const deleteQuery = 'DELETE FROM mi_keyspace.usuarios2 WHERE id = ?';

  client.execute(deleteQuery, [userId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      res.status(500).send('Error al eliminar el usuario');
    } else {
      res.redirect('/usuarios2');
    }
  });
});
//--------------------------------------------
// autor ------------------------------------- CRUD Listo
// Ruta para obtener un nuevo Autor
app.get('/authors', (req, res) => {
  const selectQuery = 'SELECT * FROM mi_keyspace.authors';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los autores:', err);
      res.status(500).send('Error al obtener los autores');
    } else {
      res.render('authors', { Authors: result.rows });
    }
  });
});
// Ruta para agregar un nuevo autor
app.post('/authors', (req, res) => {
  console.log(req.body);
  const authorName = req.body.nombre;
  const dateOfBirth = req.body.dateOfBirth;
  const country = req.body.country;
  const shortDescription = req.body.shortDescription;

  // Genera un ID único utilizando uuidv4()
  const authorId = Math.floor(Math.random() * 9000) + 1

  const insertQuery = 'INSERT INTO mi_keyspace.authors (id, nombre, dateOfBirth, country, shortDescription) VALUES (?, ?, ?, ?, ?)';

  client.execute(insertQuery, [authorId, authorName, dateOfBirth, country, shortDescription], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al agregar el autor:', err);
      res.status(500).send('Error al agregar el autor');
    } else {
      res.redirect('/authors');
    }
  });
});
// Ruta para actualizar un autor
app.post('/authors/:id', (req, res) => {
  const authorId = req.params.id;
  const { nombre, dateOfBirth, country, shortDescription } = req.body;
  const updateQuery = 'UPDATE mi_keyspace.authors SET nombre = ?, dateOfBirth = ?, country = ?, shortDescription = ? WHERE id = ?';

  client.execute(updateQuery, [nombre, dateOfBirth, country, shortDescription, authorId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al actualizar el autor:', err);
      res.status(500).send('Error al actualizar el autor');
    } else {
      res.redirect('/authors');
    }
  });
});
// Ruta para eliminar un autor
app.post('/authors/:id/delete', (req, res) => {
  const authorId = req.params.id;
  const deleteQuery = 'DELETE FROM mi_keyspace.authors WHERE id = ?';

  client.execute(deleteQuery, [parseInt(authorId)], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al eliminar el autor:', err);
      res.status(500).send('Error al eliminar el autor');
    } else {
      res.redirect('/authors');
    }
  });
});
// ------------------------------------------
// Libros CRUD listo------------------------------------------------------------
// Ruta para mostrar todos los libros
app.get('/books', (req, res) => {
  const selectQuery = 'SELECT * FROM mi_keyspace.books';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los libros:', err);
      res.status(500).send('Error al obtener los libros');
    } else {
      res.render('books', { books: result.rows });
    }
  });
});
// Ruta para agregar un nuevo libro
app.post('/books', (req, res) => {
  console.log(req.body);
  const bookId = Math.floor(Math.random() * 9000) + 1
  const bookName = req.body.nombre;
  const summary = req.body.summary;
  const dateOfPublication = req.body.dateOfPublication;
  const numberOfSales = parseInt(req.body.numberOfSales);

  const insertQuery = 'INSERT INTO mi_keyspace.books (id, nombre, summary, dateOfPublication, numberOfSales) VALUES (?, ?, ?, ?, ?)';

  client.execute(insertQuery, [bookId, bookName, summary, dateOfPublication, numberOfSales], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al agregar el libro:', err);
      res.status(500).send('Error al agregar el libro');
    } else {
      res.redirect('/books');
    }
  });
});
// Ruta para eliminar un libro
app.post('/books/:id/delete', (req, res) => {
  const bookId = parseInt(req.params.id);

  const deleteQuery = 'DELETE FROM mi_keyspace.books WHERE id = ?';

  client.execute(deleteQuery, [bookId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al eliminar el libro:', err);
      res.status(500).send('Error al eliminar el libro');
    } else {
      res.redirect('/books');
    }
  });
});
// Ruta para actualizar un libro
app.post('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookName = req.body.nombre;
  const summary = req.body.summary;
  const dateOfPublication = req.body.dateOfPublication;
  const numberOfSales = parseInt(req.body.numberOfSales);

  const updateQuery = 'UPDATE mi_keyspace.books SET nombre = ?, summary = ?, dateOfPublication = ?, numberOfSales = ? WHERE id = ?';

  client.execute(updateQuery, [bookName, summary, dateOfPublication, numberOfSales, bookId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al actualizar el libro:', err);
      res.status(500).send('Error al actualizar el libro');
    } else {
      res.redirect('/books');
    }
  });
});
// Reseñas CRUD listo---------------------------------------------------------------------
// Ruta para mostrar todas las reseñas
app.get('/reviews', (req, res) => {
  const selectQuery = 'SELECT * FROM mi_keyspace.reviews';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener las reseñas:', err);
      res.status(500).send('Error al obtener las reseñas');
    } else {
      res.render('reviews', { reviews: result.rows });
    }
  });
});

// Ruta para agregar una nueva reseña
app.post('/reviews', (req, res) => {
  console.log(req.body);
  const reviewId = Math.floor(Math.random() * 9000) + 1
  const book = req.body.book;
  const review = req.body.review;
  const score = parseInt(req.body.score);
  const numberOfVotes = parseInt(req.body.numberOfVotes);

  const insertQuery = 'INSERT INTO mi_keyspace.reviews (id, book, review, score, numberOfVotes) VALUES (?, ?, ?, ?, ?)';

  client.execute(insertQuery, [reviewId, book, review, score, numberOfVotes], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al agregar la reseña:', err);
      res.status(500).send('Error al agregar la reseña');
    } else {
      res.redirect('/reviews');
    }
  });
});

// Ruta para eliminar una reseña
app.post('/reviews/:id/delete', (req, res) => {
  const reviewId = parseInt(req.params.id);

  const deleteQuery = 'DELETE FROM mi_keyspace.reviews WHERE id = ?';

  client.execute(deleteQuery, [reviewId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al eliminar la reseña:', err);
      res.status(500).send('Error al eliminar la reseña');
    } else {
      res.redirect('/reviews');
    }
  });
});

// Ruta para actualizar una reseña
app.post('/reviews/:id', (req, res) => {
  const reviewId = parseInt(req.params.id);
  const book = req.body.book;
  const review = req.body.review;
  const score = parseInt(req.body.score);
  const numberOfVotes = parseInt(req.body.numberOfVotes);

  const updateQuery = 'UPDATE mi_keyspace.reviews SET book = ?, review = ?, score = ?, numberOfVotes = ? WHERE id = ?';

  client.execute(updateQuery, [book, review, score, numberOfVotes, reviewId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al actualizar la reseña:', err);
      res.status(500).send('Error al actualizar la reseña');
    } else {
      res.redirect('/reviews');
    }
  });
});
// ------------------------------------------------------------
// Ventas ---------------------------------------------------------------------
// Ruta para mostrar todas las ventas por año
app.get('/salesbyyear', (req, res) => {
  const selectQuery = 'SELECT * FROM mi_keyspace.salesbyyear';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener las ventas por año:', err);
      res.status(500).send('Error al obtener las ventas por año');
    } else {
      res.render('salesbyyear', { sales: result.rows });
    }
  });
});

// Ruta para agregar una nueva venta por año
app.post('/salesbyyear', (req, res) => {
  console.log(req.body);
  const saleId = Math.floor(Math.random() * 9000) + 1
  const book = req.body.book;
  const year = req.body.year;
  const sales = parseInt(req.body.sales);

  const insertQuery = 'INSERT INTO mi_keyspace.salesbyyear (id, book, year, sales) VALUES (?, ?, ?, ?)';

  client.execute(insertQuery, [saleId, book, year, sales], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al agregar la venta por año:', err);
      res.status(500).send('Error al agregar la venta por año');
    } else {
      res.redirect('/salesbyyear');
    }
  });
});

// Ruta para eliminar una venta por año
app.post('/salesbyyear/:id/delete', (req, res) => {
  const saleId = parseInt(req.params.id);

  const deleteQuery = 'DELETE FROM mi_keyspace.salesbyyear WHERE id = ?';

  client.execute(deleteQuery, [saleId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al eliminar la venta por año:', err);
      res.status(500).send('Error al eliminar la venta por año');
    } else {
      res.redirect('/salesbyyear');
    }
  });
});

// Ruta para actualizar una venta por año
app.post('/salesbyyear/:id', (req, res) => {
  const saleId = parseInt(req.params.id);
  const book = req.body.book;
  const year = req.body.year;
  const sales = parseInt(req.body.sales);

  const updateQuery = 'UPDATE mi_keyspace.salesbyyear SET book = ?, year = ?, sales = ? WHERE id = ?';

  client.execute(updateQuery, [book, year, sales, saleId], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al actualizar la venta por año:', err);
      res.status(500).send('Error al actualizar la venta por año');
    } else {
      res.redirect('/salesbyyear');
    }
  });
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});
