const express = require('express');
const cassandra = require('cassandra-driver');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'pug');
app.set('views', './views');

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
    });
  }
});


// Resto del código igual que antes

// Ruta para crear un nuevo usuario
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

// Ruta para obtener todos los usuarios
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

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});
