const express = require('express');
const cassandra = require('cassandra-driver');
const app = express();
const port = 3000;

app.use(express.json());

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
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS mi_keyspace.usuarios (
    id UUID PRIMARY KEY,
    nombre TEXT,
    email TEXT
  )
`;

client.execute(createTableQuery, (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err);
  } else {
    console.log('Tabla creada o ya existente');
  }
});

// Resto del código igual que antes

// Ruta para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const { id, nombre, email } = req.body;

  const insertQuery = `
    INSERT INTO usuarios (id, nombre, email)
    VALUES (?, ?, ?)
  `;

  client.execute(insertQuery, [id, nombre, email], { prepare: true }, (err) => {
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
app.get('/usuarios', (req, res) => {
  const selectQuery = 'SELECT * FROM usuarios';

  client.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).send('Error al obtener los usuarios');
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});
