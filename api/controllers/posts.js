import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

export const addPost = async (req, res) => {
  const { username } = req.user;
  const { category, sanitizedContent, imageURL, rowContent, title } = req.body;
  // 데이터 존재 확인 검증
  if (
    !(
      category.trim() &&
      sanitizedContent.trim() &&
      imageURL.trim() &&
      rowContent.trim() &&
      title.trim()
    )
  )
    return res.status(400).json({ message: "data is required." });
  const id = uuidv4();
  const q =
    "INSERT INTO posts (id, title, sanitized_content, row_content, image_url, category, author) VALUES (?)";
  const value = [
    id,
    title,
    sanitizedContent,
    rowContent,
    imageURL,
    category,
    username,
  ];
  db.query(q, [value], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    return res.status(201).json({ message: "created successfully", id });
  });
};

export const getPosts = async (req, res) => {
  // SELECT * FROM 테이블명 ;
  const category = req.query?.category;
  let q = "";
  if (category && ["art", "science", "technology", "food"].includes(category)) {
    q = `SELECT * FROM posts WHERE category = "${category}"`;
  } else {
    q = "SELECT * FROM posts";
  }

  const count = req.query?.count;
  q += count
    ? ` ORDER BY created_at DESC LIMIT ${count}`
    : ` ORDER BY created_at DESC LIMIT 5`;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    return res.status(200).json(results);
  });
};

export const getPost = (req, res) => {
  const id = req.params.id;
  const q = `SELECT * FROM posts WHERE id = ?`;
  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ message: err }); // 서버 오류
    return res.status(200).json(results);
  });
};
export const deletePosts = (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM posts WHERE (id = ?)`;
  db.query(q, [id], (err, results) => {
    if (err) return res.status(500).json({ message: err }); // 서버 오류
    return res.status(200).json({ message: "deleted successfully" });
  });
};
export const updatePosts = (req, res) => {
  const id = req.params.id;
  const { category, sanitizedContent, imageURL, rowContent, title } = req.body;

  // 데이터 존재 확인 검증
  if (
    !(
      category.trim() &&
      sanitizedContent.trim() &&
      imageURL.trim() &&
      rowContent.trim() &&
      title.trim()
    )
  )
    return res.status(400).json({ message: "data is required." });
  const q = `UPDATE posts SET category = ?, sanitized_content = ?, image_url = ?, row_content = ?, title = ? WHERE id = ?`;
  const value = [category, sanitizedContent, imageURL, rowContent, title, id];
  db.query(q, value, (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    return res.status(201).json({ message: "updated successfully" });
  });
};
