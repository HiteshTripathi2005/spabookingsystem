import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SMS_API_KEY: process.env.SMS_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};
