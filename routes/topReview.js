const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

const groupedReviews = (reviews) => {
  return reviews.reduce((acc, review) => {
    if (!acc[review.book]) {
      acc[review.book] = [];
    }

    acc[review.book].push({
      id: review.id,
      numberofvotes: review.numberofvotes,
      review: review.review,
      score: review.score,
    });

    return acc;
  }, {});
};

const bookStats = (groupedReviews) => {
  return Object.entries(groupedReviews).map(([bookId, reviews]) => {
    const sumVotes = reviews.reduce((total, r) => total + r.numberofvotes, 0);

    const avgScore =
      reviews.reduce((total, r) => total + r.score, 0) / reviews.length;

    return {
      bookId,
      sumVotes,
      avgScore,
    };
  });
};

const topBooks = (bookStats, bookSize, best = true) => {
  return bookStats
    .sort((a, b) => (best ? 1 : -1) * (b.avgScore - a.avgScore))
    .slice(0, bookSize < 10 ? bookSize : 10)
    .sort((a, b) => (best ? 1 : -1) * (b.sumVotes - a.sumVotes));
};

const getBookNames = (topBooks) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, nombre FROM books";

    cassandraClient.execute(query, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const bookNames = result.rows;
        
        const enrichedBooks = topBooks.map((book) => {

          
          const name = bookNames.find((bN) => bN.id == book.bookId).nombre;

          return {
            ...book,
            name,
          };
        });

        resolve(enrichedBooks);
      }
    });
  });
};

const getTop = async (result, best = true) => {
  const gR = groupedReviews(result.rows);
  const bS = bookStats(gR);
  const tB = topBooks(bS, bS.length, best);
  const enrichedTopBooks = await getBookNames(tB);
  return enrichedTopBooks;
};
/**Este router obtiene TODOS los autores y agrega autores */
router.route("/").get((req, res) => {
  const selectQuery = "SELECT * FROM reviews";

  cassandraClient.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error("Error al obtener los datos:", err);
      res.status(500).send("Error al obtener los datos");
    } else {
      getTop(result)
        .then((enrichedTopBooks) => {
          res.render("topReview", { topBooks: enrichedTopBooks });
        })
        .catch((err) => {
          console.error("Error getting top books", err);
        });
    }
  });
});

router.route("/worst").get((req, res) => {
  const selectQuery = "SELECT * FROM reviews";

  cassandraClient.execute(selectQuery, [], (err, result) => {
    if (err) {
      console.error("Error al obtener los datos:", err);
      res.status(500).send("Error al obtener los datos");
    } else {
      getTop(result, false)
        .then((enrichedTopBooks) => {
          res.render("topReview", { topBooks: enrichedTopBooks });
        })
        .catch((err) => {
          console.error("Error getting top books", err);
        });
    }
  });
});

module.exports = router