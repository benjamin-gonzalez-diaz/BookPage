// const y librerias ------------------

const express = require('express');
const cassandra = require('cassandra-driver');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'pug');
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
app.post('/usuarios2', (req, res) => {
  const { id, nombre } = req.body;

  const insertQuery = `
    INSERT INTO usuarios2 (id, nombre)
    VALUES (?, ?)
  `;

  client.execute(insertQuery, [id, nombre], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al crear el usuario:', err);
      res.status(500).send('Error al crear el usuario');
    } else {
      console.log('Usuario creado exitosamente');
      res.status(201).send('Usuario creado exitosamente');
    }
  });
});
// Ruta para obtener todos los usuarios(Ejemplo)
app.get('/usuarios2', (req, res) => {
  const selectQuery = 'SELECT * FROM usuarios2';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).send('Error al obtener los usuarios');
    } else {
      // Renderiza la plantilla Pug y pasa los datos de usuarios a la vista
      res.render('usuarios2', { users: result.rows });
    }
  });
});
// Ruta para crear un nuevo Autor
app.post('/Authors', (req, res) => {
  const { id, nombre, dateOfBirth, country, shortDescription} = req.body;

  const insertQuery = `
    INSERT INTO Authors (id, nombre, dateOfBirth, country, shortDescription)
    VALUES (?, ?, ?, ? ,?)
  `;

  client.execute(insertQuery, [id, nombre, dateOfBirth, country, shortDescription], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al crear el Authors:', err);
      res.status(500).send('Error al crear el Authors');
    } else {
      console.log('Authors creado exitosamente');
      res.status(201).send('Authors creado exitosamente');
    }
  });
});
// Ruta para obtener todos los Autores
app.get('/Authors', (req, res) => {
  const selectQuery = 'SELECT * FROM authors';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los authors:', err);
      res.status(500).send('Error al obtener los authors');
    } else {
      // Renderiza la plantilla Pug y pasa los datos de usuarios a la vista
      res.render('authors', { Authors: result.rows });
    }
  });
});
// Ruta para crear un nuevo Libro
app.post('/Books', (req, res) => {
  const { id, nombre, summary, dateOfPublication, numberOfSales} = req.body;

  const insertQuery = `
    INSERT INTO Books (id, nombre,summary, dateOfPublication, numberOfSales)
    VALUES (?, ?, ?, ? ,?)
  `;

  client.execute(insertQuery, [id, nombre, summary, dateOfPublication, numberOfSales], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al crear el Books:', err);
      res.status(500).send('Error al crear el Books');
    } else {
      console.log('Books creado exitosamente');
      res.status(201).send('Books creado exitosamente');
    }
  });
});
// Ruta para obtener todos los Libros
app.get('/Books', (req, res) => {
  const selectQuery = 'SELECT * FROM books';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los Books:', err);
      res.status(500).send('Error al obtener los Books');
    } else {
      // Renderiza la plantilla Pug y pasa los datos de usuarios a la vista
      res.render('Books', { Authors: result.rows });
    }
  });
});
// Ruta para crear un nuevo Libro
app.post('/Reviews', (req, res) => {
  const { id, book, review, score, numberOfVotes} = req.body;

  const insertQuery = `
    INSERT INTO Reviews (id, book, review, score, numberOfVotes)
    VALUES (?, ?, ?, ? ,?)
  `;

  client.execute(insertQuery, [id, book, review, score, numberOfVotes], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al crear el Reviews:', err);
      res.status(500).send('Error al crear el Reviews');
    } else {
      console.log('Reviews creado exitosamente');
      res.status(201).send('Reviews creado exitosamente');
    }
  });
});
// Ruta para obtener todos los Libros
app.get('/Reviews', (req, res) => {
  const selectQuery = 'SELECT * FROM Reviews';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los Reviews:', err);
      res.status(500).send('Error al obtener los Reviews');
    } else {
      // Renderiza la plantilla Pug y pasa los datos de usuarios a la vista
      res.render('Reviews', { Authors: result.rows });
    }
  });
});

// Ruta para crear un nuevo Review
app.post('/sales', (req, res) => {
  const { id, book, year, sales} = req.body;

  const insertQuery = `
    INSERT INTO salesbyyear (id, book,  year, sales)
    VALUES (?, ?, ?, ?)
  `;

  client.execute(insertQuery, [id, book,  year, sales], { prepare: true }, (err) => {
    if (err) {
      console.error('Error al crear el Sales:', err);
      res.status(500).send('Error al crear el Sales');
    } else {
      console.log('Sales creado exitosamente');
      res.status(201).send('Sales creado exitosamente');
    }
  });
});
// Ruta para obtener todos los Review
app.get('/sales', (req, res) => {
  const selectQuery = 'SELECT * FROM salesbyyear';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los Sales:', err);
      res.status(500).send('Error al obtener los Sales');
    } else {
      // Renderiza la plantilla Pug y pasa los datos de usuarios a la vista
      res.render('Sales', { Authors: result.rows });
    }
  });
});

// delete (not working)
// Función para eliminar un usuario por su ID
function eliminarUsuario(userId, callback) {
  const deleteQuery = `
    DELETE FROM mi_keyspace.usuarios
    WHERE id = ?
  `;

  client.execute(deleteQuery, [userId], { prepare: true }, (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      callback(err, null);
    } else {
      console.log('Usuario eliminado exitosamente');
      callback(null, result);
    }
  });
}
// Ruta para eliminar un usuario por su ID
app.delete('/usuarios/:id', (req, res) => {
  const userId = req.params.id;

  eliminarUsuario(userId, (err, result) => {
    if (err) {
      res.status(500).send('Error al eliminar el usuario');
    } else {
      res.status(200).send('Usuario eliminado exitosamente');
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
