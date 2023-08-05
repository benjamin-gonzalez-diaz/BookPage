const createTableQueryAuthorBooks = {
  query: `
CREATE TABLE IF NOT EXISTS authorbooks (
 author_id int PRIMARY KEY,
 author_name TEXT,
 total_books int,
 average_score int,
)
`,
  tablename: "authorbooks",
};

module.exports = createTableQueryAuthorBooks;
