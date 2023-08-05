const createReview = {
  query: `
    CREATE TABLE IF NOT EXISTS reviews (
     id int PRIMARY KEY,
     book INT,
     review TEXT,
     score INT,
     numberOfVotes INT
    )
    `,
  tablename: "Reviews",
};

module.exports = createReview;
