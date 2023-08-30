require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const postsRouter = require("./routes/posts.js");
const usersRouter = require("./routes/users.js");
const ROLES = require("./userRoles.js");
const jwtVerify = require("./middleware/verify.js");
const bodyParser = require("body-parser");
// const { fileURLToPath } = require("url");
const path = require("path");
const fs = require("fs");
// const s3 = require("./s3.js");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
app.get(`/images/:filename`, (req, res) => {
  const filename = req.params.filename;
  const readStream = fs.createReadStream(
    path.join(__dirname, "uploads", filename)
  );
  // const readStream = s3.getFileStream(filename);
  readStream.pipe(res);
});
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.get(
  "/api",
  jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]),
  (req, res) => res.json("success")
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
app.use((err, req, res, next) => {
  console.error(err);
  return res.sendStatus(500); // 서버 오류;
});

app.listen(PORT);
