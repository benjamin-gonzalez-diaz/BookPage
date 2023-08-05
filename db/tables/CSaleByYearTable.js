const createTableQuerySalesByYear = {
  query: `
    CREATE TABLE IF NOT EXISTS salesbyyear (
     id int PRIMARY KEY,
     book int,
     year int,
     sales int
    )
    `,
  tablename: "SalesByYear",
};

module.exports = createTableQuerySalesByYear;
