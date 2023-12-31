const cassandra = require("cassandra-driver");
const cAuthorQuery = require("./tables/CAuthorTable");
const cBookQuery = require("./tables/CBookTable");
const cReviewTable = require("./tables/CReviewTable");
const cAuthorBooksQuery = require("./tables/CQueryAuthorBooks");
const cSalesByYear = require("./tables/CSaleByYearTable");

const query_array = [
  cAuthorQuery,
  cBookQuery,
  cReviewTable,
  cAuthorBooksQuery,
  cSalesByYear,
];

const keyspace = process.env.KEYSPACE || "ks96";

const client = new cassandra.Client({
  contactPoints: [process.env.CONTACT_POINTS || "localhost"],
  localDataCenter: process.env.LOCAL_DATA_CENTER || "datacenter1",
  pooling: {
    maxRequestsPerConnection: parseInt(process.env.MAX_REQUESTS_PER_CONNECTION) || 99999999,
  },
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
  } else {
    console.log("Established connection with CassandraDB");
    client.execute(createKeyspaceQuery, (err) => {
      if (err) {
        console.log(`Error with keyspace ${keyspace}`);
        console.log(err);
      } else {
        client.execute(`USE ${keyspace}`);
        console.log(`Using ${keyspace} keyspace`);

        const promises = query_array.map((query) => {
          return new Promise((resolve, reject) => {
            client.execute(query.query, (err) => {
              if (err) {
                console.log(`error creating ${query.tablename} table: ${err}`);
                reject(err);
              } else {
                console.log(`Created or initialized ${query.tablename} table`);
                resolve();
              }
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log("All tables created successfully");
          })
          .catch((err) => {
            console.log("Error executing queries:", err);
          });
      }
    });
  }
});

module.exports = client;
