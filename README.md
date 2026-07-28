# The Daily Wire Desk — MERN News Portal

A full-stack news portal built with MongoDB, Express, React (Vite), and Node.js.
livesite:https://daily-wire-media.vercel.app/
## What's included

**Backend**
- JWT admin authentication (single admin role, no public registration)
- News CRUD with categories, tags, rich-text content, images (Cloudinary)
- Breaking / Featured / Trending flags, Draft/Published status
- Auto-delete system: each article can expire after 24h / 3d / 7d / 30d / never — a `node-cron` job
  removes expired articles from MongoDB automatically and logs each deletion
- Search (live suggestions + full search), filters by category/author/tag/date, pagination
- Admin dashboard stats API (counts + category chart + monthly chart + trending list)
- Security: Helmet, rate limiting, mongo-sanitize, xss-clean, bcrypt password hashing
- Dynamic `sitemap.xml` and `robots.txt`

**Frontend**
- Editorial-style UI (masthead, breaking-news ticker, hero slider, dateline bylines)
- Dark/light mode, fully responsive
- Homepage with Hero, Breaking Ticker, Latest, Trending, Most Viewed, Newsletter, and one section
  per category
- Live search with suggestions, category pages with pagination, article page with related articles,
  share buttons, bookmarks (stored locally), reading time
- Admin panel: login, dashboard (with charts), manage news (table + delete), add/edit news (rich text
  editor, image upload, auto-delete duration picker, SEO fields), manage categories

## Project structure

```
news-portal/
  backend/
    config/       # MongoDB + Cloudinary config
    controllers/   # Route logic
    routes/         # Express routers
    models/         # Mongoose schemas
    middleware/     # auth, error handling, upload
    jobs/           # auto-delete cron job
    utils/          # token helper, seed script
    server.js
  frontend/
    src/
      components/   # Navbar, Footer, NewsCard, HeroSlider, BreakingTicker, AdminLayout, etc.
      pages/         # Home, CategoryPage, NewsDetail, SearchResults, admin/*
      context/       # Auth, Theme, Bookmarks
      services/      # axios API layer
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, CLOUDINARY_* keys, ADMIN_EMAIL/ADMIN_PASSWORD
npm install
npm run seed     # creates the first admin account + default categories
npm run dev      # starts on http://localhost:5000
```

You'll need:
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster — recommended for deployment)
- A free Cloudinary account (cloud name, API key, API secret) for image uploads

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # starts on http://localhost:5173, proxies /api to the backend
```

Log in to the admin panel at `http://localhost:5173/admin/login` with the email/password you set in
`.env` (from the seed step).

## How the auto-delete system works

When you create or edit an article, pick an **Auto Delete** duration (Never / 24h / 3d / 7d / 30d).
The `News` model computes an `expiryDate` from that duration (relative to publish time). A cron job
(`backend/jobs/autoDeleteJob.js`, schedule set by `AUTO_DELETE_CRON` in `.env`, default: every hour)
finds all articles whose `expiryDate` has passed, deletes their Cloudinary image, permanently removes
them from MongoDB, and writes an entry to the `AutoDeleteLog` collection. The admin dashboard's
"Expired News" and "Auto Deleted" cards read from this.

## Deployment

- **Backend**: deploy to Render, Railway, or a VPS. Set all `.env` variables in the host's dashboard.
  Use MongoDB Atlas for the database (`MONGO_URI`).
- **Frontend**: `npm run build` produces a `dist/` folder — deploy to Vercel, Netlify, or any static
  host. Set `VITE`-style env vars if you externalize the API base URL (currently the Vite dev server
  proxies `/api`; in production, either serve frontend and backend from the same domain behind a
  reverse proxy, or update `src/services/api.js`'s `baseURL` to your backend's full URL and configure
  CORS's `CLIENT_URL` in the backend `.env` to match your deployed frontend domain).
- Update `robots.txt` / `sitemap.xml` base URL via `CLIENT_URL` in the backend `.env`.

## Notes / what to extend before production

- The Contact page form is UI-only — wire it to a backend route or an email service (e.g. Resend,
  EmailJS) to actually deliver messages.
- Privacy Policy and Terms pages contain placeholder copy — replace with text reviewed by counsel.
- Comments are listed as optional in the spec and are not implemented; the `News` schema and routes
  are structured so a `Comment` model + routes can be added the same way `View`/`Subscriber` were.
- Add your own Cloudinary/MongoDB credentials before running `npm run seed` or starting the server.
