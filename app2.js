const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const index = require("./routes/index");
const author = require("./routes/author");
const book = require("./routes/book");
const review = require("./routes/review");
const sale = require("./routes/sale");
const authorbook = require("./routes/author_book");

const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", index);
app.use("/authors", author);
app.use("/books", book);
app.use("/reviews", review);
app.use("/salesbyyear", sale);
app.use("/authors_books", authorbook);

app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});
