import connectToMongoDB from "./config/db.js";
import express from'express';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
const app=express();
const PORT=process.env.PORT;
dotenv.config();
//configuring backend to allow requests from frontend
app.use(cors({
    origin:'https://quickbid-frontend.onrender.com',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users",userRoutes);
app.use("/api/auctions",auctionRoutes);
app.use("/api/bids",bidRoutes);
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
    connectToMongoDB();
});
