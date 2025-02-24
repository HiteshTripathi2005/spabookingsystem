import { body, param, query } from "express-validator";

// Auth validators
export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone").notEmpty().withMessage("Phone number is required"),
];

// Service validators
export const serviceValidator = [
  body("name").trim().notEmpty().withMessage("Service name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Service description is required"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive number"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .isIn(["haircut", "spa", "facial", "massage", "other"])
    .withMessage("Invalid category"),
];

// Appointment validators
export const appointmentValidator = [
  body("serviceId").isMongoId().withMessage("Invalid service ID"),
  body("appointmentDate").isISO8601().withMessage("Invalid date format"),
];

// Review validators
export const reviewValidator = [
  body("serviceId").isMongoId().withMessage("Invalid service ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("Comment is required"),
];

// Promotion validators
export const promotionValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("discountType")
    .isIn(["percentage", "fixed"])
    .withMessage("Invalid discount type"),
  body("discountValue")
    .isFloat({ min: 0 })
    .withMessage("Discount value must be positive"),
  body("code").trim().notEmpty().withMessage("Promotion code is required"),
  body("startDate").isISO8601().withMessage("Invalid start date"),
  body("endDate").isISO8601().withMessage("Invalid end date"),
];
