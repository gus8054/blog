const express = require("express");
const {
  loginController,
  logoutController,
  refreshtokenController,
} = require("../controllers/auth.js");
const ROLES = require("../userRoles.js");
const jwtVerify = require("../middleware/verify.js");

const router = express.Router();

router.post("/login", loginController);
router.get("/refreshtoken", refreshtokenController);
router.get(
  "/logout",
  jwtVerify([ROLES.USER, ROLES.ADMIN, ROLES.EDITOR]),
  logoutController
);
module.exports = router;
