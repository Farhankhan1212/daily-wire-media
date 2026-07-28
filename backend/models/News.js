const mongoose = require("mongoose");
const slugify = require("slugify");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 500 },
    slug: { type: String, unique: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true, maxlength: 400 }, // short description
    content: { type: String, required: true }, // rich text HTML
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    author: { type: String, required: true, default: "Staff Reporter" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],

    breaking: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },

    status: { type: String, enum: ["draft", "published"], default: "draft" },

    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },

    // SEO
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },

    // Auto-delete system
    autoDeleteDuration: {
      type: String,
      enum: ["24h", "3d", "7d", "30d", "never", "custom"],
      default: "never",
    },
    expiryDate: { type: Date, default: null }, // null = never expires
    isExpired: { type: Boolean, default: false },
    autoDeletedAt: { type: Date, default: null },

    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", description: "text", content: "text" });

// Auto generate slug + set expiryDate based on autoDeleteDuration
newsSchema.pre("validate", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now()
      .toString()
      .slice(-5)}`;
  }

  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (this.isModified("autoDeleteDuration")) {
    const base = this.publishedAt || new Date();
    const map = {
      "24h": 24 * 60 * 60 * 1000,
      "3d": 3 * 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    if (map[this.autoDeleteDuration]) {
      this.expiryDate = new Date(base.getTime() + map[this.autoDeleteDuration]);
    } else if (this.autoDeleteDuration === "never") {
      this.expiryDate = null;
    }
    // "custom" -> expiryDate set explicitly by controller/admin
  }

  next();
});

// Virtual: estimated reading time (200 wpm)
newsSchema.virtual("readingTime").get(function () {
  const words = (this.content || "").replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 1000));
});

newsSchema.set("toJSON", { virtuals: true });
newsSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("News", newsSchema);
