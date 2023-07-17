import express from "express";
import jwtVerify from "../middleware/verify.js";
import { checkUserController, deleteController, registerController } from "../controllers/users.js";
import ROLES from "../userRoles.js";

const router = express.Router();
router.post("/", registerController);
router.post("/:username", jwtVerify([ROLES.ADMIN, ROLES.USER]), checkUserController);
router.delete("/:username", jwtVerify([ROLES.ADMIN, ROLES.USER]), deleteController);
export default router;
