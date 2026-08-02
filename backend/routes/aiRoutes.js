const express = require("express");
const router = express.Router();

router.post("/search", (req, res) => {
  res.json({
    success: true,
    method: req.method,
    body: req.body,
  });
});

module.exports = router;