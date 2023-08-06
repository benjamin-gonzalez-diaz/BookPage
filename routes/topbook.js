const cassandraClient = require("../db/connection");
let express = require("express");
let router = express.Router();

// top books
router.get('/', (req, res) => {
    const selectAuthorsQuery = 'SELECT * FROM ks15.authors';
    const selectBooksQuery = 'SELECT * FROM ks15.books';
    const selectSalesByYearQuery = 'SELECT * FROM ks15.salesbyyear';
  
    // Ejecutar ambas consultas en paralelo
    Promise.all([
        cassandraClient.execute(selectAuthorsQuery, [], { prepare: true }),
        cassandraClient.execute(selectBooksQuery, [], { prepare: true }),
        cassandraClient.execute(selectSalesByYearQuery, [], { prepare: true })
    ])
    .then(([authorsResult, booksResult, salesbyyearResult]) => {
      res.render('topBook', { 
        Authors: authorsResult.rows, 
        books: booksResult.rows, 
        sales: salesbyyearResult.rows
       });
    })
    .catch((err) => {
      console.error('Error al obtener datos:', err);
      res.status(500).send('Error al obtener datos');
    });
  });
  
module.exports = router