import express from "express";
import{registerUser,
	loginUser,
	getProfile,
	logoutUser,
        checkAuth
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile", getProfile);
router.post("/logout", logoutUser);
router.get("/check-auth",checkAuth);
export default router;
