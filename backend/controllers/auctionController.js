import AuctionItem from "../models/auctionitem.js";
import Bid from "../models/bid.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import auctionitem from "../models/auctionitem.js";

export const createAuctionItem=async(req,res)=>{
    const{title,description,startingBid,endDate}=req.body;
    const userId=req.user.id;
    try{
        const newDate = new Date(new Date(endDate).getTime());
		const now=(new Date().getTime());
		//const auctionEndDateTime=new Date(new Date(endDate).getTime());
		if(newDate<=now){
			return res.status(400).json({message:"End Date must be in the future"});
		}
		const auctionItem = await AuctionItem.create({
			title,
			description,
			startingBid,
			endDate: newDate,
			createdBy: userId,
		});
        await auctionItem.save();
		return res.status(201).json(auctionItem);
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};
export const getAuctionItems = async (req, res) => {
	try {
		const auctionItems = await AuctionItem.find();
		return res.status(200).json(auctionItems);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
export const getAuctionItemById = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}
		return res.status(200).json(auctionItem);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
export const getAuctionItemsByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const { id } = jwt.decode(token, process.env.JWT_SECRET, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ message: err.message });
			}
		});
		const auctionItems = await AuctionItem.find({ createdBy: id });
		return res.status(200).json({
			auctionItems,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ message: error.message });
	}
};
export const updateAuctionItem = async (req, res) => {
	const { id } = req.params;
	const { title, description, startingBid, endDate } = req.body;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		auctionItem.title = title || auctionItem.title;
		auctionItem.description = description || auctionItem.description;
		auctionItem.startingBid = startingBid || auctionItem.startingBid;
		auctionItem.endDate = endDate
			? new Date(new Date(endDate).getTime())
			: auctionItem.endDate;
		auctionItem.updatedAt = new Date(new Date().getTime());
		await auctionItem.save();

		return res.json(auctionItem);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
export const deleteAuctionItem = async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const auctionItem = await AuctionItem.findById(id);

		if (!auctionItem) {
			return res.status(404).json({ message: "Auction item not found" });
		}

		if (auctionItem.createdBy.toString() !== userId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		for (const bid of bids) {
			await bid.remove();
		}

		await AuctionItem.findByIdAndDelete(id);
		return res.json({ message: "Auction item removed" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getAuctionWinner = async (req, res) => {
	const { id } = req.params;
	try {
		const auctionItem = await AuctionItem.findById(id);
		if (!auctionItem) {
			return res
				.status(404)
				.json({ winner: "", message: "Auction item not found" });
		}

		if (new Date(auctionItem.endDate) > new Date(Date.now())) {
			return res
				.status(400)
				.json({ winner: "", message: "Auction has not ended yet" });
		}

		const bids = await Bid.find({ auctionItemId: id });
		if (bids.length === 0) {
			return res
				.status(200)
				.json({ winner: "", message: "No bids found" });
		}

		let highestBid = bids.reduce(
			(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
			bids[0]
		);

		const winner = await User.findById(highestBid.userId);
		if (!winner) {
			return res
				.status(404)
				.json({ winner: "", message: "Winner not found" });
		}

		return res.status(200).json({ winner });
	} catch (error) {
		console.error("Error fetching auction winner:", error);
		return res.status(500).json({ message: error.message });
	}
};

export const getAuctionsWonByUser = async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decodedToken;

		const bidsByUser = await Bid.find({ userId: id });
		const auctionIds = bidsByUser.map((bid) => bid.auctionItemId);

		const uniqueAuctionIds = [...new Set(auctionIds)];

		let wonAuctions = [];

		for (let i = 0; i < uniqueAuctionIds.length; i++) {
			const auctionItemId = uniqueAuctionIds[i];
			const bids = await Bid.find({ auctionItemId });
			let winningBid = bids.reduce(
				(max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
				bids[0]
			);
			const auctionItem = await AuctionItem.findById(auctionItemId);
			const isAuctionEnded =
				new Date(auctionItem.endDate) <= new Date(Date.now());

			if (isAuctionEnded && winningBid.userId.toString() === id) {
				wonAuctions.push({
					auctionId: auctionItemId,
					title: auctionItem.title,
					description: auctionItem.description,
					winningBid: winningBid.bidAmount,
					endDate: auctionItem.endDate,
				});
			}
		}
		return res.status(200).json({ wonAuctions });
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ message: error.message });
	}
};


