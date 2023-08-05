const createAuthor = {
  query: `
    CREATE TABLE IF NOT EXISTS authors (
        id int PRIMARY KEY,
        nombre TEXT,
        dateOfBirth TEXT,
        country TEXT,
        shortDescription TEXT,
    )
    `,
  tablename: "Author",
};

module.exports = createAuthor;
