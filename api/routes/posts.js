const express = require("express");
const ROLES = require("../userRoles.js");
const jwtVerify = require("../middleware/verify.js");
const {
  addPost,
  deletePosts,
  getPost,
  getPosts,
  updatePosts,
} = require("../controllers/posts.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();
router.get("/", getPosts);
router.get("/:id", getPost);
router.post(
  "/",
  jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]),
  upload.single("image"),
  addPost
);
router.delete(
  "/:id",
  jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]),
  deletePosts
);
router.patch(
  "/:id",
  jwtVerify([ROLES.USER, ROLES.EDITOR, ROLES.ADMIN]),
  upload.single("image"),
  updatePosts
);

module.exports = router;
