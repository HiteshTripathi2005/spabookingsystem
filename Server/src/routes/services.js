import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices,
} from "../controllers/serviceController.js";

const router = express.Router();

// Get all services
router.get("/", getAllServices);

// Search services
router.get("/search", searchServices);

// Get single service
router.get("/:id", getServiceById);

// Create new service (admin only)
router.post("/", auth, createService);

// Update service (admin only)
router.put("/:id", auth, updateService);

// Delete service (admin only)
router.delete("/:id", auth, deleteService);

export default router;
