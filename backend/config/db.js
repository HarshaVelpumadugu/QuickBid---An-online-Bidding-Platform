import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to MongoDB successfully");
    }catch(error){
        console.log("Error while connecting to MongoDB",error.message);
    }
};
export default connectToMongoDB;