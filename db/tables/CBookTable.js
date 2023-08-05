const createBook = {
  query: `
    CREATE TABLE IF NOT EXISTS books (
        id INT PRIMARY KEY,
        nombre TEXT,
        summary TEXT,
        dateOfPublication TEXT,
        numberOfSales INT,
        author INT,
    )
    `,
  tablename: "Books",
};

module.exports = createBook;
