const axios = require("axios");
const News = require("../models/News");
const Category = require("../models/Category");

// Categories to fetch (Currents API v1 legacy category names)
const CATEGORIES = [
  "general",
  "business",
  "sports",
  "technology",
  "science",
  "health",
  "entertainment",
  "world",
];

const fetchLatestNews = async () => {
  try {
    console.log("Fetching latest news...");
    let totalInserted = 0;

    for (const cat of CATEGORIES) {
      let response;
      try {
        response = await axios.get(
          "https://api.currentsapi.services/v1/latest-news",
          {
            params: {
              apiKey: process.env.CURRENTS_API_KEY,
              language: "en",
              country: "IN",
              category: cat,
            },
          }
        );
      } catch (catErr) {
        console.error(`Currents API Error for category "${cat}":`);
        console.error(catErr.response?.data || catErr.message);
        continue;
      }

      const articles = response.data.news || [];

      // Find or create matching category doc (capitalize first letter)
      const categoryName = cat.charAt(0).toUpperCase() + cat.slice(1);
      let category = await Category.findOne({ name: categoryName });
      if (!category) {
        category = await Category.create({
          name: categoryName,
          description: `${categoryName} News`,
        });
      }

      for (const article of articles) {
        const exists = await News.findOne({ title: article.title });
        if (exists) continue;

        await News.create({
          title: article.title,
          category: category._id,
          description:
            article.description?.substring(0, 350) ||
            "No description available",
          content: article.description || article.title,
          image: { url: article.image || "" },
          author: article.author || "Currents",
          status: "published",
          featured: false,
          breaking: false,
          trending: false,
          metaTitle: article.title,
          metaDescription: article.description?.substring(0, 160) || "",
          publishedAt: article.published
            ? new Date(article.published)
            : new Date(),
        });
        totalInserted++;
      }
    }

    console.log(`${totalInserted} new articles imported.`);
  } catch (err) {
    console.error("Currents API Error:");
    console.error(err.response?.data || err.message);
  }
};

module.exports = fetchLatestNews;