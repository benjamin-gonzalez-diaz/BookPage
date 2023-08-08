const faker = require("faker");
const { getNextId } = require("../utils");
const { createAuthor } = require("./controller/author");
const { createBook } = require("./controller/book");
const { createReview } = require("./controller/review");
const { createSale } = require("./controller/sale");

const dateToString = (date) => {
  const fd = (date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return fd(date);
};

/**Devuelve un objeto con informacion falsa de autor */
const getFakeAuthor = (id) => {
  return {
    id: id,
    nombre: faker.name.findName(),
    dateOfBirth: faker.date.between(new Date(1980), new Date(1600)),
    country: faker.address.country(),
    shortDescription: faker.lorem.paragraph(),
  };
};

/**Devuelve un objeto con informacion falsa de libro */
const getFakeBook = (author, id) => {
  return {
    id: id,
    nombre: faker.lorem.words(),
    summary: faker.lorem.paragraph(),
    dateOfPublication: faker.date.between(new Date(), author.dateOfBirth),
    numberOfSales: Math.floor(Math.random() * 1000) + 1,
    author: author.id,
  };
};

/**Devuelve un objeto con informacion falsa de review */
const getFakeReview = (book, id) => {
  return {
    id: id,
    book: book.id,
    review: faker.lorem.paragraph(),
    score: faker.datatype.number({ min: 1, max: 5 }),
    numberofVotes: faker.datatype.number({ min: 1, max: 1000 }),
  };
};

/**Devuelve un objeto con informacion falsa de una venta */
const getFakeSale = (book, id) => {
  return {
    id: id,
    book: book.id,
    year: faker.datatype.number({ min: 1700, max: 2018 }),
    sales: faker.datatype.number({ min: 1, max: 1000 }),
  };
};

async function populateData(client) {
  let nextAuthorId = await getNextId(client, "authors");
  let nextBookId = await getNextId(client, "books");
  let nextReviewId = await getNextId(client, "reviews");
  let nextSaleId = await getNextId(client, "salesbyyear");

  for (let i = 0; i <= 50; i++) {
    author = getFakeAuthor(nextAuthorId);
    author_cp = { ...author };
    author_cp.dateOfBirth = dateToString(author_cp.dateOfBirth);
    a_result = await createAuthor(client, author_cp);
    nextAuthorId++;

    const authorBooks = faker.datatype.number({ min: 2, max: 10 });
    for (let j = 0; j <= authorBooks; j++) {
      book = getFakeBook(author, nextBookId);
      book_cp = { ...book };
      book_cp.dateOfPublication = dateToString(book_cp.dateOfPublication);
      b_result = await createBook(client, book_cp);
      nextBookId++;

      const bookReviews = faker.datatype.number({ min: 3, max: 5 });
      for (let k = 1; k <= bookReviews; k++) {
        review = getFakeReview(book, nextReviewId);
        nextReviewId++;
        r_result = await createReview(client, review);
      }

      let salesYears = [];
      while (salesYears.length < 5) {
        const sale = getFakeSale(book, nextSaleId);
        nextSaleId++;
        s_result = await createSale(client, sale);
        const year = sale.year;
        if (salesYears.indexOf(year) == -1) salesYears.push(year);
      }
    }
  }
}

module.exports = {
  populateData,
};
