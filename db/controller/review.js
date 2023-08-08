const { runQuery } = require("./utils");

const queries = {
  create:
    "INSERT INTO reviews (id, book, review, score, numberOfVotes) VALUES (?, ?, ?, ?, ?)",
  update:
    "UPDATE reviews SET book = ?, review = ?, score = ?, numberOfVotes = ? WHERE id = ?",
  delete: "DELETE FROM reviews WHERE id = ?",
  getAll: "SELECT * FROM reviews",
};

async function createReview(client, reviewData) {
  query = queries.create;
  data = [
    reviewData.id,
    reviewData.book,
    reviewData.review,
    reviewData.score,
    reviewData.numberofVotes,
  ];

  return await runQuery(client, query, data);
}
async function updateReview(client, reviewData) {
  const query = queries.update;
  const data = [
    reviewData.book,
    reviewData.review,
    reviewData.score,
    reviewData.numberofVotes,
    reviewData.id,
  ];

  return await runQuery(client, query, data);
}
async function deleteReview(client, reviewData) {
  const query = queries.delete;
  const data = [reviewData.id];

  return await runQuery(client, query, data);
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
