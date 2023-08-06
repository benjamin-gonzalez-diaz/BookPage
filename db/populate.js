const faker = require("faker");
const { getLastId } = require("../utils");
const { createAuthor } = require("./controller/author");
const { createBook } = require("./controller/book");
const { createReview } = require("./controller/review");
const { createSale } = require("./controller/sale");

/**Genera una fecha random */
function getRandomDate(minDate = null, maxDate = null) {
  const maxD = maxDate ? maxDate : new Date();
  const minD = minDate ? minDate : new Date(0);
  const timestamp =
    Math.floor(Math.random() * (maxD.getTime() - minD.getTime())) +
    minD.getTime();
  return new Date(timestamp);
}

/**Devuelve un objeto con informacion falsa de autor */
const getFakeAuthor = (client) => {
  return {
    id: getLastId(client, "authors") + 1,
    nombre: faker.name.findName(),
    dateOfBirth: getRandomDate(null, new Date(1990, 1, 1)),
    country: faker.address.country(),
    shortDescription: faker.lorem.paragraph(),
  };
};

/**Devuelve un objeto con informacion falsa de libro */
const getFakeBook = (client, author) => {
  const min = author.dateOfBirth.getFullYear() + 14;
  const max = author.dateOfBirth.getFullYear() + 80;
  const randomDate = Math.floor(Math.random() * (max - min + 1)) + min;

  return {
    id: getLastId(client, "books") + 1,
    nombre: faker.lorem.words(),
    summary: faker.lorem.paragraph(),
    dateOfPublication: randomDate,
    numberOfSales: Math.floor(Math.random() * 1000) + 1,
    author: author.id,
  };
};

/**Devuelve un objeto con informacion falsa de review */
const getFakeReview = (client, book) => {
  return {
    id: getLastId(client, "reviews") + 1,
    book: book.id,
    review: faker.lorem.paragraph(),
    score: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
    numberofVotes: Math.floor(Math.random() * 1000) + 1,
  };
};

/**Devuelve un objeto con informacion falsa de una venta */
const getFakeSale = (client, book) => {
  const randomYear = getRandomDate(
    new Date(book.dateOfPublication)
  ).getFullYear();
  return {
    id: getLastId(client, "salesbyyear") + 1,
    book: book.id,
    year: randomYear,
    sales: Math.floor(Math.random() * 1000) + 1,
  };
};

const populateData = (client) => {
  for (let i = 0; i <= 50; i++) {
    author = getFakeAuthor(client);
    createAuthor(client, author);

    const authorBooks = Math.floor(Math.random() * 20) + 1;
    for (let j = 0; j <= authorBooks; j++) {
      book = getFakeBook(client, author);
      createBook(client, book);

      const bookReviews = Math.floor(Math.random() * 10) + 1;
      for (let k = 1; k <= bookReviews; k++) {
        review = getFakeReview(client, book);
        createReview(client, review);
      }

      let salesYears = [];
      let k = 0;
      while (salesYears.length < 5 && k < 80) {
        const sale = getFakeSale(client, book);
        createSale(client, sale);
        const year = sale.year;
        if (salesYears.indexOf(year) == -1) salesYears.push(year);
        k++;
      }
    }
  }
};

module.exports = {
  populateData,
};
