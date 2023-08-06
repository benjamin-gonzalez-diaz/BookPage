const { runQuery } = require("./utils");
const queries = {
  create:
    "INSERT INTO books (id, nombre, summary, dateOfPublication, numberOfSales) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE books SET nombre = ?, summary = ?, dateOfPublication = ?, numberOfSales = ? WHERE id = ?",
  delete: "DELETE FROM books WHERE id = ?",
  getAll: "SELECT * FROM books",
};

const createBook = (client, bookData) => {
  const query = queries.create;
  const data = [
    bookData.id,
    bookData.name,
    bookData.summary,
    bookData.dateOfPublication,
    bookData.numberOfSales,
  ];

  success = runQuery(client, query, data);
};
const updateBook = (client, bookData) => {
  const query = queries.update;
  const data = [
    bookData.name,
    bookData.summary,
    bookData.dateOfPublication,
    bookData.numberOfSales,
    bookData.id,
  ];

  success = runQuery(client, query, data);
};
const deleteBook = (client, bookData) => {
  const query = queries.delete;
  const data = [bookData.id];

  success = runQuery(client, query, data);
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
};
