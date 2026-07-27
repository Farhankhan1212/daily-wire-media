const express = require("express");
const { getTags, createTag } = require("../controllers/tagController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getTags);
router.post("/", protect, createTag);

module.exports = router;
