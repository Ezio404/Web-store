import express from "express";
import { signup,logout,login, refreshToken,getprofile } from "../controllers/userController.js";
import { protectroute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);
router.post("/refresh-token",refreshToken);
router.get("/profile",protectroute,getprofile);

export default router;