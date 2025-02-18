import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const registerUser=async(req,res)=>{
    const{username,email,password,confirmPassword}=req.body;
    try{
        if(!username || !email || !password || !confirmPassword){
            return res.status(400).json({error:"All fields are required"});
        }
        if(password!=confirmPassword){
            return res.status(400).json({error:"Password's don't match"});
        }
        const ExistingUser=await User.findOne({username});
        if(ExistingUser){
            return res.status(400).json({error:"username already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            username,
            email,
            password:hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            id:newUser._id,
            username:newUser.username,
            email:newUser.email,
        });
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};
export const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({error:"All fields are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User doesn't exist"});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({error:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"3d",
        });
        res.cookie("jwt",token,{
            httpOnly:false,
            sameSite:"none",
            secure:true,
            expires:new Date(Date.now()+24*60*60*1000),
        });
        res.status(200).json({
            id:user._id,
            username:user.username,
            email:user.email,
            token:token
        });
    }
    catch(err){
        res.status(500).json({error:"Internal server error"});
    }
};
export const getProfile=async(req,res)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decoded=jwt.decode(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Invalid Token"});
        }
        const{id}=decoded;
        const user=await User.findById(id);
        if(!user){
            return res.status(404).json({error:"User not Found"});
        }
        res.status(200).json({
            id:user._id,
            username:user.username,
            email:user.email,
        });
    }
    catch(err){
        return res.status(500).json({error:"Internal Server Error"});
    }
};
export const logoutUser=async(req,res)=>{
    try{
        res.cookie("jwt","",{
            httpOnly:false,
            sameSite:"none",
            expires:new Date(0),
            secure:true,
        });
        res.status(200).json({message:"Logged Out Successfully"});
    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
};
