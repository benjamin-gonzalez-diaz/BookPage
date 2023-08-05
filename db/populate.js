const faker = require("faker");

// Función para llenar la base de datos con authors
function populateFakeAuthors(id) {
  return {
    id: id,
    nombre: faker.name.findName(),
    dateOfBirth: faker.date.past().toISOString().split("T")[0],
    country: faker.address.country(),
    shortDescription: faker.lorem.paragraph(),
  };
}

// Función para llenar la base de datos con books
function populateFakeBooks(bookId, authorId, authorBirth) {
  //se selecciona al azar una fecha que estè entre la fecha de nacimiento del autor y el dìa actual
  const currentDate = new Date();
  const birthDate = new Date(authorBirth);
  const timeDifference = Math.abs(currentDate.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  const randomSelect = Math.floor(Math.random() * diffDays) + 1;
  const randomDate = new Date(
    birthDate.getTime() + randomSelect * (1000 * 3600 * 24)
  );

  return {
    id: bookId,
    nombre: faker.lorem.words(),
    summary: faker.lorem.paragraph(),
    dateOfPublication: randomDate.toISOString().split("T")[0],
    numberOfSales: Math.floor(Math.random() * 1000) + 1,
    author: authorId,
  };
}

function populateFakeReviews(reviewId, bookId) {
  return {
    id: reviewId,
    book: bookId,
    review: faker.lorem.paragraph(),
    score: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
    numberofVotes: Math.floor(Math.random() * 1000) + 1,
  };
}

function populateFakeSales(saleId, bookId, year) {
  return {
    id: saleId,
    book: bookId,
    year: year,
    sales: Math.floor(Math.random() * 1000) + 1,
  };
}

let allBookId = 0;

function populateData(client) {
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

module.exports = {
  populateData,
};
