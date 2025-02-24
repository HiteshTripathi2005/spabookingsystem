import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllReviews,
  getServiceReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Get all reviews
router.get("/", getAllReviews);

// Get reviews for a specific service
router.get("/service/:serviceId", getServiceReviews);

// Add new review
router.post("/", auth, createReview);

// Update review
router.put("/:id", auth, updateReview);

// Delete review
router.delete("/:id", auth, deleteReview);

export default router;
