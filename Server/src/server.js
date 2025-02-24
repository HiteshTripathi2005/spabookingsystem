import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import config from "./config/config.js";
import authRoutes from "./routes/auth.js";
import servicesRoutes from "./routes/services.js";
import appointmentsRoutes from "./routes/appointments.js";
import reviewsRoutes from "./routes/reviews.js";
import promotionsRoutes from "./routes/promotions.js";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/promotions", promotionsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

connectDB()
  .then(() =>
    app.listen(config.PORT, () => console.log("app is listening on port 3000"))
  )
  .catch((error) => console.error(error));
