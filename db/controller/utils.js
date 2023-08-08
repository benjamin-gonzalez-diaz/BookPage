async function runQuery(client, query, data) {
  return new Promise((resolve, reject) => {
    client.execute(query, data, { prepare: true }, (err, result) => {
      if (err) {
        console.error("Query failed:", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  runQuery,
};
