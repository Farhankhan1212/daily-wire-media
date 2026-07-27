const Subscriber = require("../models/Subscriber");

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const exists = await Subscriber.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: "This email is already subscribed" });
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    next(err);
  }
};

const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    next(err);
  }
};

module.exports = { subscribe, getSubscribers };
