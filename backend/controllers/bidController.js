import Bid from "../models/bid.js";
import AuctionItem from "../models/auctionitem.js";
import jwt from "jsonwebtoken";

export const placeBid=async(req,res)=>{
    const{auctionItemId,bidAmount}=req.body;
    const userId=req.user.id;
    if(!auctionItemId || !bidAmount || bidAmount<=0){
        return res.status(400).json({error:"Invalid bid details"});
    }
    try{
        const auctionItem=await AuctionItem.findById(auctionItemId);
        if(!auctionItem){
            return res.status(404).json({error:"Auction Item not Found"});
        }
        if(bidAmount < auctionItem.startingBid){
            return res.status(404).json({error:"Bid Amount must be greater than or equal to starting bid"});
        }
        if (auctionItem.createdBy.toString() === userId) {
            return res.status(403).json({ message: "You cannot bid on your own auction" });
        }
        let bid=await Bid.findOne({auctionItemId,userId});
        if(bid){
            if(bidAmount > bid.bidAmount){
                bid.bidAmount=bidAmount;
                await bid.save();
                return res.status(200).json(bid);
            }
            else{
                return res.status(400).json({error:"New Bid must be greater than the current bid"});
            }
        }
        const newBid=await Bid.create({
            auctionItemId,
            userId,
            bidAmount,
        });
        await newBid.save();
        return res.status(201).json(newBid);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
export const getBidHistory=async(req,res)=>{
    const{auctionItemId}=req.params;
    if(!auctionItemId){
        return res.status(400).json({error:"Auction Item Id is required"});
    }
    try{
        const bids=await Bid.find({auctionItemId}).populate("userId","username");
        return res.status(200).json(bids);
    }
    catch(err){
        res.status(500).json({error:"err.message"});
    }
};
export const getBidsByUser=async(req,res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const {id}=jwt.decode(token,process.env.JWT_SECRET,(err)=>{
            if(err){
                return res.status(500).json({error:err.message});
            }
        });
        let bids=await Bid.find({userId:id});
        bids=await Promise.all(
            bids.map(async(bid)=>{
                const auctionItem=await AuctionItem.findById(bid.auctionItemId);
                const bidObject=bid.toObject();
                delete bidObject.auctionItemId;
                return {...bidObject,auctionItem};
            })
        );
        return res.status(200).json({bids});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};