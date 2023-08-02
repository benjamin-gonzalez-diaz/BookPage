const express = require('express')
const app = express()
const cassandra = require('cassandra-driver')

// Configurar la conexión a Cassandra
const client = new cassandra.Client({
  contactPoints: ['localhost'], // Reemplaza 'localhost' con la dirección de tu cluster de Cassandra
  localDataCenter: 'datacenter1', // Reemplaza 'datacenter1' con el nombre del data center
})

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

client.execute('select key from system.local', (err, result) => {
  if (err) throw err
  console.log(result.rows[0])
})
