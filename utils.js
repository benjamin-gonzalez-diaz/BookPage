function getNextId(client, tablename) {
  return new Promise((resolve, reject) => {
    const query = `SELECT MAX(id) FROM ${tablename}`;

    client.execute(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const max = result.rows[0]["system.max(id)"];
        if (max) resolve(max + 1);
        else resolve(1);
      }
    });
  });
}

module.exports = { getNextId };
