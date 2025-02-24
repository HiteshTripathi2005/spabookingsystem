import Promotion from "../models/Promotion.js";

// Get all active promotions
export const getActivePromotions = async (req, res) => {
  try {
    const currentDate = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate("applicableServices", "name price");

    res.json(promotions);
  } catch (error) {
    console.error("Get promotions error:", error);
    res.status(500).json({ error: "Error fetching promotions" });
  }
};

// Get single promotion
export const getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "applicableServices",
      "name price"
    );

    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    res.json(promotion);
  } catch (error) {
    console.error("Get promotion error:", error);
    res.status(500).json({ error: "Error fetching promotion" });
  }
};

// Create new promotion
export const createPromotion = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to create promotions" });
    }

    const {
      title,
      description,
      discountType,
      discountValue,
      code,
      startDate,
      endDate,
      applicableServices,
      maxUses,
    } = req.body;

    // Check if promotion code already exists
    const existingPromotion = await Promotion.findOne({ code });
    if (existingPromotion) {
      return res.status(400).json({ error: "Promotion code already exists" });
    }

    const promotion = new Promotion({
      title,
      description,
      discountType,
      discountValue,
      code,
      startDate,
      endDate,
      applicableServices,
      maxUses,
    });

    await promotion.save();

    const populatedPromotion = await Promotion.findById(promotion._id).populate(
      "applicableServices",
      "name price"
    );

    res.status(201).json({
      message: "Promotion created successfully",
      promotion: populatedPromotion,
    });
  } catch (error) {
    console.error("Create promotion error:", error);
    res.status(500).json({ error: "Error creating promotion" });
  }
};

// Update promotion
export const updatePromotion = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to update promotions" });
    }

    const {
      title,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      applicableServices,
      maxUses,
    } = req.body;

    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    // Update fields
    if (title) promotion.title = title;
    if (description) promotion.description = description;
    if (discountType) promotion.discountType = discountType;
    if (discountValue) promotion.discountValue = discountValue;
    if (startDate) promotion.startDate = startDate;
    if (endDate) promotion.endDate = endDate;
    if (isActive !== undefined) promotion.isActive = isActive;
    if (applicableServices) promotion.applicableServices = applicableServices;
    if (maxUses) promotion.maxUses = maxUses;

    await promotion.save();

    const updatedPromotion = await Promotion.findById(req.params.id).populate(
      "applicableServices",
      "name price"
    );

    res.json({
      message: "Promotion updated successfully",
      promotion: updatedPromotion,
    });
  } catch (error) {
    console.error("Update promotion error:", error);
    res.status(500).json({ error: "Error updating promotion" });
  }
};

// Delete promotion
export const deletePromotion = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete promotions" });
    }

    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    // Instead of deleting, set isActive to false
    promotion.isActive = false;
    await promotion.save();

    res.json({ message: "Promotion deactivated successfully" });
  } catch (error) {
    console.error("Delete promotion error:", error);
    res.status(500).json({ error: "Error deleting promotion" });
  }
};

// Validate promotion code
export const validatePromotionCode = async (req, res) => {
  try {
    const { code, serviceId } = req.body;

    const currentDate = new Date();
    const promotion = await Promotion.findOne({
      code,
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    if (!promotion) {
      return res
        .status(404)
        .json({ error: "Invalid or expired promotion code" });
    }

    // Check if promotion is applicable to the service
    if (serviceId && !promotion.applicableServices.includes(serviceId)) {
      return res
        .status(400)
        .json({ error: "Promotion not applicable to this service" });
    }

    // Check if promotion has reached maximum uses
    if (promotion.maxUses && promotion.usedCount >= promotion.maxUses) {
      return res.status(400).json({ error: "Promotion limit reached" });
    }

    res.json({
      message: "Promotion code is valid",
      promotion,
    });
  } catch (error) {
    console.error("Validate promotion error:", error);
    res.status(500).json({ error: "Error validating promotion code" });
  }
};
