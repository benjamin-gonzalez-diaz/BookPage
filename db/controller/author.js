const cassandraClient = require("../connection");
const { runQuery } = require("./utils");

const queries = {
  create:
    "INSERT INTO authors (id, nombre, dateOfBirth, country, shortDescription) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE authors SET nombre = ?, dateOfBirth = ?, country = ?, shortDescription = ? WHERE id = ?",
  delete: "DELETE FROM authors WHERE id = ?",
  getAll: "SELECT * FROM authors",
};

async function createAuthor(client, authorData) {
  const query = queries.create;
  const data = [
    authorData.id,
    authorData.nombre,
    authorData.dateOfBirth,
    authorData.country,
    authorData.shortDescription,
  ];
  return await runQuery(client, query, data);
}

async function updateAuthor(client, authorData) {
  const query = queries.update;
  const data = [
    authorData.id,
    authorData.nombre,
    authorData.dateOfBirth,
    authorData.country,
    authorData.shortDescription,
  ];
  return await runQuery(client, query, data);
}

async function deleteAuthor(client, authorData) {
  const query = queries.delete;
  const data = [authorData.id];

  return await runQuery(client, query, data);
}

module.exports = {
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
