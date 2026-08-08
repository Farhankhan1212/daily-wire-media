const express = require("express");
const router = express.Router();

const { aiSearch } = require("../controllers/aiController");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Route Working",
  });
});

router.post("/search", aiSearch);

module.exports = router;