const express = require("express");
const router = express.Router();

const { aiSearch } = require("../controllers/aiController");

// GET /api/ai
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Route Working",
  });
});

// POST /api/ai/search
router.post("/search", (req, res) => {
  res.json({
    success: true,
    message: "POST Search Route Working",
    body: req.body,
  });
});

module.exports = router;