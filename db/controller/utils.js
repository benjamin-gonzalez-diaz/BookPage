const runQuery = async (client, query, data) => {
  try {
    return await client.execute(query, data, { prepare: true });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  runQuery,
};
