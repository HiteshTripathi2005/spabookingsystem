export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export const isStaff = (req, res, next) => {
  if (!["admin", "staff"].includes(req.user.role)) {
    return res.status(403).json({ error: "Staff access required" });
  }
  next();
};
