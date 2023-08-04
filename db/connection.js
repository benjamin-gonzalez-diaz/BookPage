const cassandra = require('cassandra-driver');
const keyspace = "ks12"

const client = new cassandra.Client({ 
    contactPoints: ['localhost'], 
    localDataCenter: 'datacenter1', 
  });

const createKeyspaceQuery = `
  CREATE KEYSPACE IF NOT EXISTS ${keyspace}
  WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  }
`;

client.connect((err) => {
    if (err) {
        console.log("Could't establish connection");
        console.log(err);
    }
    else {
        console.log("Established connection with CassandraDB")
        client.execute(createKeyspaceQuery, (err) => {
            if (err) {
                console.log(`Error with keyspace ${keyspace}`);
                console.log(err);
            }
            else {
                client.execute(`USE ${keyspace}`)
                console.log(`Using ${keyspace} keyspace`)
            }
        })
    }
})