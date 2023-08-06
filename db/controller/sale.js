const { runQuery } = require("./utils");

const queries = {
  create:
    "INSERT INTO reviews (id, book, review, score, numberOfVotes) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE reviews SET book = ?, review = ?, score = ?, numberOfVotes = ? WHERE id = ?",
  delete: "DELETE FROM reviews WHERE id = ?",
  getAll: "SELECT * FROM reviews",
};

const createSale = (client, saleData) => {
  const query = queries.create;
  const data = [
    saleData.id,
    saleData.book,
    saleData.review,
    saleData.score,
    saleData.numberofVotes,
  ];

  success = runQuery(client, query, data);
};
const updateSale = (client, saleData) => {
  const query = queries.update;
  const data = [
    saleData.book,
    saleData.review,
    saleData.score,
    saleData.numberofVotes,
    saleData.id,
  ];

  success = runQuery(client, query, data);
};

const deleteSale = (client, saleData) => {
  const query = queries.delete;
  data = [saleData.id];

  success = runQuery(client, query, data);
};

module.exports = {
  createSale,
  updateSale,
  deleteSale,
};
