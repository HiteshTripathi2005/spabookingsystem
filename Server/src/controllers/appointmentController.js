import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

// Get all appointments (admin) or user appointments (customer)
export const getAppointments = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, show only their appointments
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      query.appointmentDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const appointments = await Appointment.find(query)
      .populate("user", "name email phone")
      .populate("service", "name duration price")
      .sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
};

// Get single appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("service", "name duration price");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.role !== "admin" &&
      appointment.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this appointment" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({ error: "Error fetching appointment" });
  }
};

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const { serviceId, appointmentDate, notes } = req.body;

    // Validate service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    if (!service.isActive) {
      return res.status(400).json({ error: "Service is not available" });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      service: serviceId,
      appointmentDate,
      status: { $nin: ["cancelled"] },
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "Time slot not available" });
    }

    // Create appointment
    const appointment = new Appointment({
      user: req.user._id,
      service: serviceId,
      appointmentDate,
      totalAmount: service.price,
      notes,
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("user", "name email phone")
      .populate("service", "name duration price");

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ error: "Error creating appointment" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Only admin can update any appointment status
    // Users can only cancel their own appointments
    if (req.user.role !== "admin") {
      if (appointment.user.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ error: "Not authorized to update this appointment" });
      }
      if (status !== "cancelled") {
        return res
          .status(403)
          .json({ error: "Users can only cancel appointments" });
      }
    }

    // Validate status transition
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      cancelled: [],
      completed: [],
    };

    if (!validTransitions[appointment.status].includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from ${appointment.status} to ${status}`,
      });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("service", "name duration price");

    res.json({
      message: "Appointment status updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment status error:", error);
    res.status(500).json({ error: "Error updating appointment status" });
  }
};

// Get available time slots
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({
        error: "Service ID and date are required",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get booked appointments for the day
    const bookedAppointments = await Appointment.find({
      service: serviceId,
      appointmentDate: { $gte: startDate, $lte: endDate },
      status: { $nin: ["cancelled"] },
    });

    // Generate available time slots
    const businessHours = {
      start: 9, // 9 AM
      end: 17, // 5 PM
    };

    const slots = [];
    const duration = service.duration;
    let currentTime = new Date(startDate);
    currentTime.setHours(businessHours.start, 0, 0, 0);

    while (currentTime.getHours() < businessHours.end) {
      const isBooked = bookedAppointments.some(
        (apt) => apt.appointmentDate.getTime() === currentTime.getTime()
      );

      if (!isBooked) {
        slots.push(new Date(currentTime));
      }

      currentTime = new Date(currentTime.getTime() + duration * 60000);
    }

    res.json(slots);
  } catch (error) {
    console.error("Get available slots error:", error);
    res.status(500).json({ error: "Error fetching available time slots" });
  }
};
