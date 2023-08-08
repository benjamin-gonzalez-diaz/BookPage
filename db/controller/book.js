const { runQuery } = require("./utils");
const queries = {
  create:
    "INSERT INTO books (id, nombre, summary, dateOfPublication, numberOfSales, author) VALUES (?, ?, ?, ?, ?, ?)",
  update:
    "UPDATE books SET nombre = ?, summary = ?, dateOfPublication = ?, numberOfSales = ?, author = ? WHERE id = ?",
  delete: "DELETE FROM books WHERE id = ?",
  getAll: "SELECT * FROM books",
};

async function createBook(client, bookData) {
  const query = queries.create;
  const data = [
    bookData.id,
    bookData.nombre,
    bookData.summary,
    bookData.dateOfPublication,
    bookData.numberOfSales,
    bookData.author,
  ];

  return await runQuery(client, query, data);
}
async function updateBook(client, bookData) {
  const query = queries.update;
  const data = [
    bookData.nombre,
    bookData.summary,
    bookData.dateOfPublication,
    bookData.numberOfSales,
    bookData.author,
    bookData.id,
  ];

  return await runQuery(client, query, data);
}
async function deleteBook(client, bookData) {
  const query = queries.delete;
  const data = [bookData.id];

  return await runQuery(client, query, data);
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
};
