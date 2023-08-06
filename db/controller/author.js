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

const createAuthor = (client, authorData) => {
  const query = queries.create;
  const data = [
    authorData.id,
    authorData.nombre,
    authorData.dateOfBirth,
    authorData.country,
    authorData.shortDescription,
  ];
  const success = runQuery(client, query, data);
};

const updateAuthor = (client, authorData) => {
  const query = queries.update;
  const data = [
    authorData.id,
    authorData.nombre,
    authorData.dateOfBirth,
    authorData.country,
    authorData.shortDescription,
  ];
  const success = runQuery(client, query, data);
};

const deleteAuthor = (client, authorData) => {
  const query = queries.delete;
  const data = [authorData.id];

  const success = runQuery(client, query, data);
};

module.exports = {
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
