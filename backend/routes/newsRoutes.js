const express = require("express");
const {
  createNews,
  getNews,
  getNewsBySlug,
  getNewsById,
  updateNews,
  deleteNews,
  getDashboardStats,
  searchSuggestions,
} = require("../controllers/newsController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getNews);
router.get("/search/suggestions", searchSuggestions);
router.get("/stats/dashboard", protect, getDashboardStats); // admin only
router.get("/id/:id", protect, getNewsById); // admin only - fetch by id for edit form
router.get("/:slug", getNewsBySlug);

// Admin only
router.post("/", protect, upload.single("image"), createNews);
router.put("/:id", protect, upload.single("image"), updateNews);
router.delete("/:id", protect, deleteNews);

module.exports = router;
