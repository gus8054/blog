const db = require("../db.js");
const bcrypt = require("bcrypt");
const ROLES = require("../userRoles.js");
const saltRounds = 10;

async function getUsers(req, res) {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    if (!results.length)
      return res.status(404).json({ message: "user not exist" });
    return res.status(200).json(results);
  });
}
exports.getUsers = getUsers;

async function registerController(req, res) {
  const { username, password, email } = req.body;
  // 데이터 존재 확인 검증
  if (!(username.trim() && password.trim() && email.trim()))
    return res.status(400).json({ message: "data is required." });
  // 아이디 중복 확인
  const selectQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
  db.query(selectQuery, [username, email], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    if (results.length)
      return res.status(400).json({ message: "중복된 아이디입니다." });
    // 패스워드 암호화
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
      // 사용자 정보 객체 만들기
      const value = [username, email, hash, ROLES.USER];
      // 사용자 정보 DB에 저장하기
      const insertQuery =
        "INSERT INTO users (username, email, password, role) VALUES (?)";
      db.query(insertQuery, [value], (err, results) => {
        if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
        return res.status(201).json({ message: "created successfully" });
      });
    });
  });
}
exports.registerController = registerController;

const deleteController = (req, res) => {
  const username = req.params.username;
  const deleteQuery = "DELETE FROM users WHERE (username = ?)";
  db.query(deleteQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    res.clearCookie("jwt", { httpOnly: true, signed: true });
    return res.status(201).json({ message: "deleted successfully" });
  });
};
exports.deleteController = deleteController;

const checkUserController = (req, res) => {
  const username = req.params.username;
  const { password } = req.body;
  // 데이터 존재 확인 검증
  if (!(username.trim() && password.trim()))
    return res.status(400).json({ message: "data is required" });
  // 아이디 존재 확인
  const selectQuery = "SELECT * FROM users WHERE username = ?";
  db.query(selectQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    if (!results.length)
      return res.status(404).json({ message: "user not exist" });
    const foundUser = results[0];
    // 찾은 계정과 비밀번호 일치 확인
    bcrypt.compare(password, foundUser.password, async function (err, isEqual) {
      if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
      if (!isEqual)
        return res.status(401).json({ message: "invalid password" }); // 비밀번호 틀림
      return res.status(200).json({ message: "ok" });
    });
  });
};
exports.checkUserController = checkUserController;
