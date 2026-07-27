const Tag = require("../models/Tag");

const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ success: true, tags });
  } catch (err) {
    next(err);
  }
};

const createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ success: true, tag });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTags, createTag };
