import express from "express";
import{createAuctionItem,
	getAuctionItems,
	updateAuctionItem,
	deleteAuctionItem,
	getAuctionItemById,
	getAuctionItemsByUser,
	getAuctionWinner,
	getAuctionsWonByUser,
} from "../controllers/auctionController.js";
import { protectRoute} from "../middleware/protectRoute.js";
const router=express.Router();
router.route("/").get(getAuctionItems).post(protectRoute,createAuctionItem);
router.post("/user", protectRoute, getAuctionItemsByUser);
router.get("/winner/:id", protectRoute, getAuctionWinner);
router.post("/won", protectRoute, getAuctionsWonByUser);
router
	.route("/:id")
	.get(protectRoute, getAuctionItemById)
	.put(protectRoute, updateAuctionItem)
	.delete(protectRoute, deleteAuctionItem);
export default router;