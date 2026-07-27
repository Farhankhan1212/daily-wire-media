const express = require("express");
const { subscribe, getSubscribers } = require("../controllers/subscriberController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", subscribe);
router.get("/", protect, getSubscribers);

module.exports = router;
