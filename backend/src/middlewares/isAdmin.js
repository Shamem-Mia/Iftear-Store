// middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default isAdmin;
