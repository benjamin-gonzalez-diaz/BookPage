// script.js
const cassandra = require('cassandra-driver');
// Configura la conexión a Cassandra en el cliente
const client = new cassandra.Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'mi_keyspace'
});

// Función para eliminar un usuario
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

// Resto del código (funciones updateUser y deleteUser, etc.)
  


// Función para conectar el cliente de Cassandra y luego ejecutar las funciones necesarias
function conectarClienteYFunciones() {
  client.connect((err) => {
    if (err) {
      console.error('Error al conectar a Cassandra:', err);
    } else {
      console.log('Conexión a Cassandra establecida');

      // Ejecutar aquí las funciones que dependen de client
      // Por ejemplo, aquí puedes llamar a las funciones updateUser y deleteUser

      // Llamar a la función eliminarUsuario desde aquí después de que el cliente se haya conectado
      eliminarUsuario(1, (err, result) => {
        if (err) {
          console.error('Error al eliminar el usuario:', err);
        } else {
          console.log('Usuario eliminado exitosamente');
        }
      });
    }
  });
}

// Llamar a la función para conectar el cliente y ejecutar las funciones necesarias
conectarClienteYFunciones();

function updateUser(userId) {
  // Aquí puedes implementar la lógica para actualizar el usuario con el ID proporcionado
  console.log('Actualizar usuario:',userId);
  }

  function deleteUser(userId) {
  // Aquí puedes implementar la lógica para eliminar el usuario con el ID proporcionado
  console.log('Eliminar usuario:', userId);
  }