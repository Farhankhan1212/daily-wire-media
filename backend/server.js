require("dotenv").config();
const startNewsCron = require("./jobs/newsCron");
const express = require("express"); 
const cors = require("cors"); 
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const aiRoutes = require("./routes/aiRoutes");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { startAutoDeleteJob } = require("./jobs/autoDeleteJob");

const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const News = require("./models/News");

const app = express();

// Security middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://daily-wire-media.vercel.app",
  "https://daily-wire-media-m1gp56yko-farhankhan1212s-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());

// Global rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Routes
app.use("/api/admin", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Daily Wire Media Backend API is running 🚀",
  });
});
// SEO helpers
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(
    `User-agent: *\nAllow: /\nSitemap: ${process.env.CLIENT_URL || "http://localhost:5173"}/sitemap.xml`
  );
});

app.get("/sitemap.xml", async (req, res, next) => {
  try {
    const base = process.env.CLIENT_URL || "http://localhost:5173";
    const articles = await News.find({ status: "published" })
      .select("slug updatedAt")
      .limit(5000);

    const urls = [
      `<url><loc>${base}/</loc></url>`,
      ...articles.map(
        (a) =>
          `<url><loc>${base}/news/${a.slug}</loc><lastmod>${a.updatedAt.toISOString()}</lastmod></url>`
      ),
    ].join("");

    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
    );
  } catch (err) {
    next(err);
  }
});

app.get("/health", (req, res) => res.json({ success: true, status: "ok" }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );

      startAutoDeleteJob();

      startNewsCron();
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  });