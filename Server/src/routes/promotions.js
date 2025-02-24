import express from "express";
import auth from "../middleware/auth.js";
import {
  getActivePromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCode,
} from "../controllers/promotionController.js";

const router = express.Router();

// Get all active promotions
router.get("/", getActivePromotions);

// Get single promotion
router.get("/:id", getPromotionById);

// Create new promotion (admin only)
router.post("/", auth, createPromotion);

// Update promotion (admin only)
router.put("/:id", auth, updatePromotion);

// Delete promotion (admin only)
router.delete("/:id", auth, deletePromotion);

// Validate promotion code
router.post("/validate", validatePromotionCode);

export default router;
