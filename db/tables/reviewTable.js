const query = `
CREATE TABLE IF NOT EXISTS reviews (
  book TEXT,
  review TEXT,
  score INT,
  votes_up INT,
  PRIMARY KEY ((review), score, votes_up)
)
`;