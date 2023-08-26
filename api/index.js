import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { default as authRouter } from "./routes/auth.js";
import { default as postsRouter } from "./routes/posts.js";
import { default as usersRouter } from "./routes/users.js";
import ROLES from "./userRoles.js";
import jwtVerify from "./middleware/verify.js";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";

const PORT = process.env.PORT || 8000;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
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
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.use((err, req, res, next) => {
  console.error(err);
  return res.sendStatus(500); // 서버 오류;
});

app.listen(PORT);
