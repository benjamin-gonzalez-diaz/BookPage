const express = require('express')
const app = express()
const cassandra = require('cassandra-driver')
const client = new cassandra.Client({ contactPoints: ['localhost'] })
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