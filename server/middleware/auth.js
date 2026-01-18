import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import AppError from "../utils/AppError.js";

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("token with bearer", token);

    if (!token || typeof token !== "string" || !token.startsWith("Bearer ")) {
      return next(
        new AppError("Access denied. Invalid authorization header.", 401)
      );
    }

    token = token.split(" ")[1];
    console.log("token", token);

    const secret = process.env.JWT_TOKEN_SECRET;
    const decoded = jwt.verify(token, secret);
    console.log("decoded", decoded);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("User does not exist", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Access denied.", 401));
    }
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired. Please log in again.", 401));
    }
    next(err);
  }
};

export default auth;
