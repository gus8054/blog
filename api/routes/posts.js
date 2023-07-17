import express from "express";
import ROLES from "../userRoles.js";
import jwtVerify from "../middleware/verify.js";
import { addPost, deletePosts, getPost, getPosts, updatePosts } from "../controllers/posts.js";

const router = express.Router();
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]), addPost);
router.delete("/:id", jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]), deletePosts);
router.patch("/:id", jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]), updatePosts);

export default router;
