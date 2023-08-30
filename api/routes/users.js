const express = require("express");
const ROLES = require("../userRoles.js");
const jwtVerify = require("../middleware/verify.js");
const {
  checkUserController,
  deleteController,
  getUsers,
  registerController,
} = require("../controllers/users.js");

const router = express.Router();
router.get("/", getUsers);
router.post("/", registerController);
router.post(
  "/:username",
  jwtVerify([ROLES.ADMIN, ROLES.USER]),
  checkUserController
);
router.delete(
  "/:username",
  jwtVerify([ROLES.ADMIN, ROLES.USER]),
  deleteController
);
module.exports = router;
