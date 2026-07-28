const News = require("../models/News");
const View = require("../models/View");
const Category = require("../models/Category");
const AutoDeleteLog = require("../models/AutoDeleteLog");

// @desc   Create news
// @route  POST /api/news
// @access Private (Admin)
const createNews = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (req.file) {
      body.image = { url: req.file.path, publicId: req.file.filename };
    }

    if (typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const news = await News.create(body);
    res.status(201).json({ success: true, news });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all news (public: only published & non-expired; admin: all via ?all=true)
// @route  GET /api/news
// @access Public / Private
const getNews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      author,
      tag,
      search,
      dateFrom,
      dateTo,
      breaking,
      featured,
      trending,
      status,
      all,
    } = req.query;

    const query = {};

   if (!all) {
  query.status = "published";
  query.$or = [
    { expiryDate: null },
    { expiryDate: { $gt: new Date() } },
  ];
} else if (status) {
  query.status = status;
}
if (category) {
  const cat = await Category.findOne({
    $or: [
      { name: category },
      { slug: category.toLowerCase().replace(/\s+/g, "-") },
    ],
  });

  if (cat) {
    query.category = cat._id;
  } else {
    return res.json({
      success: true,
      count: 0,
      total: 0,
      page: Number(page),
      pages: 0,
      news: [],
    });
  }
}

  
    if (author) query.author = { $regex: author, $options: "i" };
    if (tag) query.tags = tag;
    if (breaking) query.breaking = breaking === "true";
    if (featured) query.featured = featured === "true";
    if (trending) query.trending = trending === "true";

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, totalCount] = await Promise.all([
      News.find(query)
        .populate("category", "name slug")
        .populate("tags", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      News.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: items.length,
      total: totalCount,
      page: Number(page),
      pages: Math.ceil(totalCount / Number(limit)),
      news: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single news by slug + log a view + related articles
// @route  GET /api/news/:slug
// @access Public
const getNewsBySlug = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug })
      .populate("category", "name slug")
      .populate("tags", "name slug");

    if (!news) {
      return res.status(404).json({ success: false, message: "News article not found" });
    }

    // Log view (fire and forget) + increment counter
    news.views += 1;
    await news.save();
    View.create({
      news: news._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    }).catch(() => {});

    const related = await News.find({
      _id: { $ne: news._id },
      category: news.category?._id,
      status: "published",
    })
      .limit(4)
      .select("title slug image createdAt");

    res.json({ success: true, news, related });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single news by id (for admin edit forms - no view count increment)
// @route  GET /api/news/id/:id
// @access Private (Admin)
const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id)
      .populate("category", "name slug")
      .populate("tags", "name slug");
    if (!news) return res.status(404).json({ success: false, message: "News not found" });
    res.json({ success: true, news });
  } catch (err) {
    next(err);
  }
};

// @desc   Update news
// @route  PUT /api/news/:id
// @access Private (Admin)
const updateNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });

    const body = { ...req.body };
    if (req.file) {
      body.image = { url: req.file.path, publicId: req.file.filename };
    }
    if (typeof body.tags === "string") {
      body.tags = body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    Object.assign(news, body);
    await news.save();

    res.json({ success: true, news });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete news
// @route  DELETE /api/news/:id
// @access Private (Admin)
const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });
    res.json({ success: true, message: "News deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc   Dashboard stats
// @route  GET /api/news/stats/dashboard
// @access Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalNews,
      breakingNews,
      featuredNews,
      draftNews,
      publishedNews,
      categoriesCount,
      expiredNews,
      autoDeletedCount,
      perCategoryAgg,
      monthlyAgg,
      trendingArticles,
    ] = await Promise.all([
      News.countDocuments(),
      News.countDocuments({ breaking: true }),
      News.countDocuments({ featured: true }),
      News.countDocuments({ status: "draft" }),
      News.countDocuments({ status: "published" }),
      Category.countDocuments(),
      News.countDocuments({ expiryDate: { $ne: null, $lte: new Date() } }),
      AutoDeleteLog.countDocuments(),
      News.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
        { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
        { $project: { name: "$cat.name", count: 1, _id: 0 } },
      ]),
      News.aggregate([
        { $match: { status: "published", publishedAt: { $ne: null } } },
        {
          $group: {
            _id: { year: { $year: "$publishedAt" }, month: { $month: "$publishedAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      News.find({ trending: true }).sort({ views: -1 }).limit(5).select("title slug views"),
    ]);

    res.json({
      success: true,
      cards: {
        totalNews,
        breakingNews,
        featuredNews,
        draftNews,
        publishedNews,
        categoriesCount,
        expiredNews,
        autoDeletedCount,
      },
      charts: {
        perCategory: perCategoryAgg,
        monthlyPublished: monthlyAgg,
        trendingArticles,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Search suggestions (live search)
// @route  GET /api/news/search/suggestions?q=
// @access Public
const searchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ success: true, suggestions: [] });

    const suggestions = await News.find({
      status: "published",
      title: { $regex: q, $options: "i" },
    })
      .limit(6)
      .select("title slug image");

    res.json({ success: true, suggestions });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createNews,
  getNews,
  getNewsBySlug,
  getNewsById,
  updateNews,
  deleteNews,
  getDashboardStats,
  searchSuggestions,
};
