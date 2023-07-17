import express from "express";
import { loginController, logoutController, refreshtokenController } from "../controllers/auth.js";
import ROLES from "../userRoles.js";
import jwtVerify from "../middleware/verify.js";

const router = express.Router();
router.post("/login", loginController);
router.get("/refreshtoken", refreshtokenController);
router.get("/logout", jwtVerify([ROLES.USER, ROLES.ADMIN, ROLES.EDITOR]), logoutController);
export default router;
