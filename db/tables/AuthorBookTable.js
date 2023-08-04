const query = `
CREATE TABLE IF NOT EXISTS author_books (
  name TEXT,
  birthday TIMESTAMP,
  country TEXT,
  short_description TEXT,
  title TEXT,
  summary TEXT,
  publication_date TEXT,
  PRIMARY KEY ((name), birthday, country)
)
`;