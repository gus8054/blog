import jwt from "jsonwebtoken";
import ROLES from "../userRoles.js";

function jwtVerify(roles = [ROLES.ADMIN, ROLES.EDITOR, ROLES.USER]) {
  return (req, res, next) => {
    // jwt 유무 확인
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "user not logged in" });
    // jwt 검증
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        // console.console.log(err);
        return res.status(403).json({ message: err.message }); // 검증 에러
      }
      // req 객체에 현재 유저의 정보를 추가
      const { username, email, role } = decoded;
      // 사용자 role 확인
      if (!roles.includes(role)) return res.status(403).json({ message: "forbidden" }); // 해당 역할 접근 금지
      // req객체에 사용자 정보 추가
      const currentUser = { username, email, role };
      req.user = currentUser;
      // 검증 통과
      next();
    });
  };
}
export default jwtVerify;
