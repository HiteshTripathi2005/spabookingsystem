import Review from "../models/Review.js";
import Appointment from "../models/Appointment.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("service", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

// Get reviews for a specific service
export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const reviews = await Review.find({ service: serviceId })
      .populate("user", "name")
      .populate("service", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Get service reviews error:", error);
    res.status(500).json({ error: "Error fetching service reviews" });
  }
};

// Add new review
export const createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    // Verify user has an appointment for this service
    const appointment = await Appointment.findOne({
      user: req.user._id,
      service: serviceId,
      status: "completed",
    });

    if (!appointment) {
      return res.status(403).json({
        error: "Can only review services you have experienced",
      });
    }

    // Check if user has already reviewed this service
    const existingReview = await Review.findOne({
      user: req.user._id,
      service: serviceId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this service" });
    }

    const review = new Review({
      user: req.user._id,
      service: serviceId,
      rating,
      comment,
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("service", "name");

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Error creating review" });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    const updatedReview = await Review.findById(req.params.id)
      .populate("user", "name")
      .populate("service", "name");

    res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Error updating review" });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Error deleting review" });
  }
};
