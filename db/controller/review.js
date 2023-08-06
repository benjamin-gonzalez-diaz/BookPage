const { runQuery } = require("./utils");

const queries = {
  create:
    "INSERT INTO reviews (id, book, review, score, numberOfVotes) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE reviews SET book = ?, review = ?, score = ?, numberOfVotes = ? WHERE id = ?",
  delete: "DELETE FROM reviews WHERE id = ?",
  getAll: "SELECT * FROM reviews",
};

const createReview = (client, reviewData) => {
  query = queries.create;
  data = [
    reviewData.id,
    reviewData.book,
    reviewData.review,
    reviewData.score,
    reviewData.numberofVotes,
  ];

  success = runQuery(client, query, data);
};
const updateReview = (client, reviewData) => {
  const query = queries.update;
  const data = [
    reviewData.book,
    reviewData.review,
    reviewData.score,
    reviewData.numberofVotes,
    reviewData.id,
  ];

  success = runQuery(client, query, data);
};
const deleteReview = (client, reviewData) => {
  const query = queries.delete;
  const data = [reviewData.id];

  success = runQuery(client, query, data);
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
