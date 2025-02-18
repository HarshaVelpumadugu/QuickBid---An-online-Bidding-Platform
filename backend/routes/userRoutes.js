import express from "express";
import{registerUser,
	loginUser,
	getProfile,
	logoutUser,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile", getProfile);
router.post("/logout", logoutUser);
export default router;