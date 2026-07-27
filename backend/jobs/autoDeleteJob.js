const cron = require("node-cron");
const News = require("../models/News");
const AutoDeleteLog = require("../models/AutoDeleteLog");
const { cloudinary } = require("../config/cloudinary");

// Finds every news article whose expiryDate has passed and permanently
// removes it from MongoDB (and its Cloudinary image), logging what was deleted.
const runAutoDelete = async () => {
  try {
    const expired = await News.find({
      expiryDate: { $ne: null, $lte: new Date() },
    }).populate("category", "name");

    if (expired.length === 0) return;

    for (const article of expired) {
      if (article.image?.publicId) {
        await cloudinary.uploader.destroy(article.image.publicId).catch(() => {});
      }

      await AutoDeleteLog.create({
        newsTitle: article.title,
        newsSlug: article.slug,
        category: article.category?.name || "Uncategorized",
        expiryDate: article.expiryDate,
      });

      await News.findByIdAndDelete(article._id);
    }

    console.log(`[auto-delete] Removed ${expired.length} expired article(s) at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("[auto-delete] Job failed:", err.message);
  }
};

const startAutoDeleteJob = () => {
  const schedule = process.env.AUTO_DELETE_CRON || "0 * * * *"; // default: every hour
  cron.schedule(schedule, runAutoDelete);
  console.log(`[auto-delete] Scheduled with cron pattern "${schedule}"`);

  // Also run once on startup so nothing lingers while the server was offline
  runAutoDelete();
};

module.exports = { startAutoDeleteJob, runAutoDelete };
