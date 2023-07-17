import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { default as authRouter } from "./routes/auth.js";
import { default as postsRouter } from "./routes/posts.js";
import { default as usersRouter } from "./routes/users.js";
import ROLES from "./userRoles.js";
import jwtVerify from "./middleware/verify.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.get("/api", jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]), (req, res) => res.json("success"));

app.use((err, req, res, next) => {
  console.error(err);
  return res.sendStatus(500); // 서버 오류;
});
app.listen(8001);
