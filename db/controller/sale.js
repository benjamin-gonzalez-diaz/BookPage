const { runQuery } = require("./utils");

const queries = {
  create: "INSERT INTO salesbyyear (id, book, year, sales) VALUES (?, ?, ?, ?)",
  update: "UPDATE salesbyyear SET book = ?, year = ?, sales = ? WHERE id = ?",
  delete: "DELETE FROM salesbyyear WHERE id = ?",
  getAll: "SELECT * FROM salesbyyear",
};

async function createSale(client, saleData) {
  const query = queries.create;
  const data = [saleData.id, saleData.book, saleData.year, saleData.sales];

  return await runQuery(client, query, data);
}
async function updateSale(client, saleData) {
  const query = queries.update;
  const data = [saleData.book, saleData.year, saleData.sales, saleData.id];

  return await runQuery(client, query, data);
}

async function deleteSale(client, saleData) {
  const query = queries.delete;
  data = [saleData.id];

  return await runQuery(client, query, data);
}

module.exports = {
  createSale,
  updateSale,
  deleteSale,
};
