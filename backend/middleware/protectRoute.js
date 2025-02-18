import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protectRoute = async (req, res, next) => {
  try {
    //const token = req.headers.authorization?.startsWith("Bearer")
      //? req.headers.authorization.split(" ")[1]
      //: req.cookies?.jwt;
      const token = req.rawHeaders
      .find((header) => header.includes("jwt="))
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    console.log("Received Token:", token); // 🔍 Debugging Line

    if (!token) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // 🔍 Debugging Line

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found, authorization denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message); // 🔍 Debugging Line
    res.status(401).json({ success: false, message: "Invalid token, authorization denied" });
  }
};
