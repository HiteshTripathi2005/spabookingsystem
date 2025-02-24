import Service from "../models/Service.js";

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by active status if provided
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const services = await Service.find(query).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ error: "Error fetching services" });
  }
};

// Get single service
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ error: "Error fetching service" });
  }
};

// Create new service
export const createService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to create services" });
    }

    const { name, description, duration, price, category } = req.body;

    // Create new service
    const service = new Service({
      name,
      description,
      duration,
      price,
      category,
      image: req.file?.path, // If using multer for image upload
    });

    await service.save();
    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ error: "Error creating service" });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to update services" });
    }

    const { name, description, duration, price, category, isActive } = req.body;
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Update fields
    if (name) service.name = name;
    if (description) service.description = description;
    if (duration) service.duration = duration;
    if (price) service.price = price;
    if (category) service.category = category;
    if (isActive !== undefined) service.isActive = isActive;
    if (req.file?.path) service.image = req.file.path;

    await service.save();
    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ error: "Error updating service" });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Not authorized to delete services" });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Instead of deleting, set isActive to false
    service.isActive = false;
    await service.save();

    res.json({ message: "Service deactivated successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Error deleting service" });
  }
};

// Search services
export const searchServices = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const services = await Service.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        },
      ],
    });

    res.json(services);
  } catch (error) {
    console.error("Search services error:", error);
    res.status(500).json({ error: "Error searching services" });
  }
};
