import express from "express";
import auth from "../middleware/auth.js";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  getAvailableTimeSlots,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Get all appointments
router.get("/", auth, getAppointments);

// Get available time slots
router.get("/available-slots", auth, getAvailableTimeSlots);

// Get single appointment
router.get("/:id", auth, getAppointmentById);

// Create new appointment
router.post("/", auth, createAppointment);

// Update appointment status
router.patch("/:id/status", auth, updateAppointmentStatus);

export default router;
