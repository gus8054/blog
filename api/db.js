// get the client
import mysql from "mysql2";

// create the connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "blog",
  password: "o59259o7!3",
});

export default db;
// simple query
