const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// @desc   Login admin
// @route  POST /api/admin/login
// @access Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get current logged in admin
// @route  GET /api/admin/me
// @access Private
const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

module.exports = { loginAdmin, getMe };
