import express from "express";
import{placeBid, getBidHistory, getBidsByUser} from "../controllers/bidController.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router();
router.post("/",protectRoute,placeBid);
router.get("/:auctionItemId",protectRoute,getBidHistory);
router.post("/user",protectRoute,getBidsByUser);
export default router;