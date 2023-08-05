const cassandra = require("cassandra-driver");
const cAuthorQuery = require("./tables/CAuthorTable");
const cBookQuery = require("./tables/CBookTable");
const cReviewTable = require("./tables/CReviewTable");
const cAuthorBooksQuery = require("./tables/CQueryAuthorBooks");
const cSalesByYear = require("./tables/CSaleByYearTable");

const {
  populateFakeAuthors,
  populateFakeBooks,
  populateFakeReviews,
  populateFakeSales,
} = require("./populate");

const query_array = [
  cAuthorQuery,
  cBookQuery,
  cReviewTable,
  cAuthorBooksQuery,
  cSalesByYear,
];

const keyspace = "ks15";

const client = new cassandra.Client({
  contactPoints: ["localhost"],
  localDataCenter: "datacenter1",
});

const createKeyspaceQuery = `
  CREATE KEYSPACE IF NOT EXISTS ${keyspace}
  WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 1
  }
`;

function populateData() {
  let allBookId = 1000;
  let saleId = 100;
  const numAuthors = 5;
  for (let authorId = 0; authorId < numAuthors; authorId++) {
    totalBooks = 0;
    const fakeAuthor = populateFakeAuthors(authorId);
    const insertQuery =
      "INSERT INTO authors (id, nombre, dateOfBirth, country, shortDescription) VALUES (?, ?, ?, ?, ?)";
    client.execute(
      insertQuery,
      [
        fakeAuthor.id,
        fakeAuthor.nombre,
        fakeAuthor.dateOfBirth,
        fakeAuthor.country,
        fakeAuthor.shortDescription,
      ],
      { prepare: true },
      (err) => {
        if (err) {
          console.error("No se agregó autor:", err);
        }
      }
    );

    const randomNum = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

    for (let bookId = 0; bookId < randomNum; bookId++) {
      console.log("libro por autor", bookId);
      console.log("BOOK ID", allBookId);
      const fakeBook = populateFakeBooks(
        allBookId,
        authorId,
        fakeAuthor.dateOfBirth
      );

      const insertQuery =
        "INSERT INTO books (id, nombre, summary, dateOfPublication, numberOfSales, author) VALUES (?, ?, ?, ?, ?, ?)";
      client.execute(
        insertQuery,
        [
          fakeBook.id,
          fakeBook.nombre,
          fakeBook.summary,
          fakeBook.dateOfPublication,
          fakeBook.numberOfSales,
          fakeBook.author,
        ],
        { prepare: true },
        (err) => {
          if (err) {
            console.error("No se agregó libro:", err);
          }
        }
      );
      allBookId++;
      totalBooks++;
      acumulatedScore = 0;
      for (
        let reviewId = 0;
        reviewId < Math.floor(Math.random() * (10 - 1 + 1)) + 1;
        reviewId++
      ) {
        const fakeReview = populateFakeReviews(reviewId, fakeBook.id);
        const insertQuery =
          "INSERT INTO reviews (id, book, review, score, numberOfVotes) VALUES (?, ?, ?, ?, ?)";
        client.execute(
          insertQuery,
          [
            fakeReview.id,
            fakeReview.book,
            fakeReview.review,
            fakeReview.score,
            fakeReview.numberofVotes,
          ],
          { prepare: true },
          (err) => {
            if (err) {
              console.error("No se agregó review:", err);
            }
          }
        );
        acumulatedScore += fakeReview.score;
      }
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const bookYear = parseInt(fakeBook.dateOfPublication.slice(0, 4));
      for (let counter = bookYear; counter < currentYear + 1; counter++) {
        const fakeSale = populateFakeSales(saleId, bookId, counter);
        const insertQuery =
          "INSERT INTO salesbyyear (id, book, year, sales) VALUES (?, ?, ?, ?)";
        client.execute(
          insertQuery,
          [fakeSale.id, fakeSale.book, fakeSale.year, fakeSale.sales],
          { prepare: true },
          (err) => {
            if (err) {
              console.error("No se agregó sale:", err);
            }
          }
        );
        saleId++;
      }
    }
    console.log("TOTALBOOKS", totalBooks);
    const insertQueryTable =
      "INSERT INTO authorbooks (author_id, author_name, total_books, average_score) VALUES (?, ?, ?, ?)";

    client.execute(
      insertQueryTable,
      [fakeAuthor.id, fakeAuthor.nombre, totalBooks, acumulatedScore],
      { prepare: true },
      (err) => {
        if (err) {
          console.error("No se agregó a la tabla:", err);
        }
      }
    );
  }
}

client.connect((err) => {
  if (err) {
    console.log("Could't establish connection");
    console.log(err);
  } else {
    console.log("Established connection with CassandraDB");
    client.execute(createKeyspaceQuery, (err) => {
      if (err) {
        console.log(`Error with keyspace ${keyspace}`);
        console.log(err);
      } else {
        client.execute(`USE ${keyspace}`);
        console.log(`Using ${keyspace} keyspace`);

        const promises = query_array.map((query) => {
          return new Promise((resolve, reject) => {
            client.execute(query.query, (err) => {
              if (err) {
                console.log(`error creating ${query.tablename} table: ${err}`);
                reject(err);
              } else {
                console.log(`Created or initialized ${query.tablename} table`);
                resolve();
              }
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            console.log("All tables created successfully");
            populateData();
          })
          .catch((err) => {
            console.log("Error executing queries:", err);
          });
      }
    });
  }
});

module.exports = client;
