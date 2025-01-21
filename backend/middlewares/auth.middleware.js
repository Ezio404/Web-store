import jwt from "jsonwebtoken";
import {User} from "../models/usermodel.js";


export const protectroute = async (req, res, next) => {
  try {
    const accesstoken = req.cookies.accesstoken;
    if (!accesstoken) {
      return res.status(401).json({ message: "no access token provided" });
    }

    try {
      const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);      //decodes the userid from token

      const user = await User.findById(decoded.userId).select("-password");             //finds the user

      if (!user) {
        return res.status(401).json({ message: "user not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "unauthorized- invalid access toekn" });
  }
}

export const adminroute = (req, res, next) => {
  if (req.user && req.user.isAdmin === "admin") {
    next();
  } else {
    return res.status(401).json({ message: "unauthorized- admin required" });
  }
};