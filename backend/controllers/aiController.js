const { GoogleGenerativeAI } = require("@google/generative-ai");
const News = require("../models/News");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an AI search assistant for a news website.

User Search:
"${query}"

Return only 5-10 important search keywords separated by commas.

Example:

Input:
Latest AI news in India

Output:
AI, Artificial Intelligence, India, Technology
`;

    const result = await model.generateContent(prompt);

    const keywords = result.response
      .text()
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    let mongoQuery = {
      status: "published",
    };

    if (keywords.length > 0) {
      mongoQuery.$or = [];

      keywords.forEach((word) => {
        mongoQuery.$or.push(
          {
            title: {
              $regex: word,
              $options: "i",
            },
          },
          {
            description: {
              $regex: word,
              $options: "i",
            },
          },
          {
            content: {
              $regex: word,
              $options: "i",
            },
          }
        );
      });
    }

    const news = await News.find(mongoQuery)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      aiKeywords: keywords,
      total: news.length,
      news,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI Search Failed",
    });
  }
};

module.exports = {
  aiSearch,
};