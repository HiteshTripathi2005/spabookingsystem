import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Please authenticate" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

export default auth;
