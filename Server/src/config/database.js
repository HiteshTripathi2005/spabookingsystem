import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${config.MONGODB_URI}/spa`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
