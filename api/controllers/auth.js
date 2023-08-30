const db = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginController(req, res) {
  const { username, password } = req.body;
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
      // jwt payload에 담을 객체 생성
      const { password, ...others } = foundUser;
      // jwt 객체 생성 - access token
      const accessToken = jwt.sign(others, process.env.ACCESS_TOKEN_SECRET, {
        issuer: "DH",
        expiresIn: "15s",
      });
      // jwt 객체 생성 - refresh token
      const refreshToken = jwt.sign(others, process.env.REFRESH_TOKEN_SECRET, {
        issuer: "DH",
        expiresIn: "1d",
      });
      // 생성한 refresh token을 서버에서 관리하기 위해 유저별로 저장.
      // 해당 계정에 연결된 refresh token이 이미 DB에 존재한다면(즉, 다른 기기로 로그인 한다면) refresh token 교체(이전 로그인정보 삭제)
      const selectRefreshQuery =
        "SELECT * FROM refreshtokens WHERE username = ?";
      db.query(selectRefreshQuery, [foundUser.username], (err, results) => {
        if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류

        const query = results.length
          ? "UPDATE refreshtokens SET refreshtoken = ? WHERE (username = ?)"
          : "INSERT INTO refreshtokens (refreshtoken, username) VALUES (?, ?)";
        db.query(query, [refreshToken, foundUser.username], (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "서버 오류" }); // 서버 오류
          }
          // refresh token 쿠키에 서명하기, 실제 서비스땐 https 프로토콜만 사용하도록 하고 secure 속성 추가
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            signed: true,
          });
          return res.status(200).json({ accessToken });
        });
      });
    });
  });
}
exports.loginController = loginController;

async function logoutController(req, res) {
  // verify 미들웨어를 거쳐서 사용자 인증을 마쳤다고 가정한다.
  const { username } = req.user;
  // refresh token DB에서 refresh token을 제거한다.
  const deleteQuery = "DELETE FROM refreshtokens WHERE (username = ?)";
  db.query(deleteQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
    // 클라이언트의 쿠키에서도 refresh token을 제거한다.
    res.clearCookie("jwt", { httpOnly: true, signed: true });
    return res.status(200).json({ message: "logged out successfully" });
  });
}
exports.logoutController = logoutController;

async function refreshtokenController(req, res) {
  // request 쿠키에 refresh token 유무 검사
  const refreshToken = req?.signedCookies?.jwt;
  if (!refreshToken)
    return res.status(403).json({ message: "refresh token not exist" });
  // refresh token 검증
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    function (err, decoded) {
      if (err) return res.status(403).json({ message: err.message }); // 검증 에러
      // refreshtokens table에 저장되어있는 user인지 확인
      // 만약 없다면 관리자가 임의로 삭제시킨 블랙리스트 토큰이라는 뜻이다. 따라서 accesstoken을 반환하면 안된다.
      const { username, email, role } = decoded;
      const selectQuery = "SELECT * FROM refreshtokens WHERE username = ?";
      db.query(selectQuery, [username], (err, results) => {
        if (err) return res.status(500).json({ message: "서버 오류" }); // 서버 오류
        if (!results.length)
          return res.status(403).json({ message: "Forbidden" });
        const accessToken = jwt.sign(
          { username, role, email },
          process.env.ACCESS_TOKEN_SECRET,
          { issuer: "DH", expiresIn: "15s" }
        );
        return res.status(200).json({ accessToken });
      });
    }
  );
}
exports.refreshtokenController = refreshtokenController;
