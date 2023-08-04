const query = `
CREATE TABLE IF NOT EXISTS books (
  title TEXT,
  summary TEXT,
  publication_date TEXT,
  sales_number int,
  PRIMARY KEY ((title), summary, publication_date)
)
`;