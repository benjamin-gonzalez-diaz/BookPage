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

module.exports = {
  populateFakeAuthors,
  populateFakeBooks,
  populateFakeReviews,
  populateFakeSales,
};
