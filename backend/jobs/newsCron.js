const cron = require("node-cron");
const fetchLatestNews = require("../services/currentsService");

const startNewsCron = () => {

  console.log("News cron started.");

  // Run immediately on startup
  fetchLatestNews();

  // Every 30 minutes
  cron.schedule("*/30 * * * *", async () => {

    console.log("Running News Cron...");

    await fetchLatestNews();

  });

};

module.exports = startNewsCron;