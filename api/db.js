// get the client
import mysql from "mysql2";

// create the connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "blog",
  password: process.env.MYSQL_PASSWORD,
});

export default db;
// simple query
