const getLastId = (client, tablename) => {
  query = `SELECT MAX(id) FROM ${tablename};`;
  return client.execute(query).then((result) => {
    if (result.rows.length === 0) {
      return 0;
    } else {
      return result.first().max;
    }
  });
};

module.exports = { getLastId };
