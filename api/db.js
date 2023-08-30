// get the client
const mysql = require("mysql2");

// create the connection to database
const db = mysql.createConnection({
  host: "gus8054-blog.ceofgmlics0b.ap-northeast-2.rds.amazonaws.com",
  user: "gus8054",
  database: "blog",
  password: process.env.MYSQL_PASSWORD,
});

// create the connection to database
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "blog",
//   password: process.env.MYSQL_PASSWORD,
// });

module.exports = db;
// simple query
