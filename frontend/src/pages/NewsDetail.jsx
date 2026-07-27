import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEye, FiClock, FiBookmark, FiHeart } from "react-icons/fi";
import { fetchNewsBySlug } from "../services/api";
import { useBookmarks } from "../context/BookmarkContext";
import ShareButtons from "../components/ShareButtons";
import { Spinner } from "../components/Loaders";
import NewsCard from "../components/NewsCard";

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const { data } = await fetchNewsBySlug(slug);
        setNews(data.news);
        setRelated(data.related || []);
      } catch (err) {
        setNews(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <Spinner />;
  if (!news) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Article not found</h2>
        <p className="text-slate-650 mb-6">It may have expired or been removed.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <article className="py-8 max-w-3xl mx-auto">
      <Helmet>
        <title>{news.metaTitle || news.title} — The Daily Wire Desk</title>
        <meta name="description" content={news.metaDescription || news.description} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.description} />
        <meta property="og:image" content={news.image?.url} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <p className="section-eyebrow mb-3">{news.category?.name}</p>
      <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight mb-4">{news.title}</h1>
      <p className="text-lg text-slate-650 dark:text-paper-dim/70 mb-6">{news.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-4 hairline py-4 mb-6">
        <div className="dateline">
          By <span className="text-ink dark:text-paper font-semibold not-italic">{news.author}</span> ·{" "}
          {new Date(news.publishedAt || news.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </div>
        <div className="flex items-center gap-4 text-sm dateline">
          <span className="flex items-center gap-1"><FiClock size={13} /> {news.readingTime} min read</span>
          <span className="flex items-center gap-1"><FiEye size={13} /> {news.views} views</span>
        </div>
      </div>

      {news.image?.url && (
        <img src={news.image.url} alt={news.title} className="w-full rounded-sm mb-8 object-cover max-h-[480px]" />
      )}

      <div
        className="news-content prose dark:prose-invert max-w-none text-[17px]"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      {news.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {news.tags.map((t) => (
            <span key={t._id} className="text-xs font-mono uppercase tracking-wide bg-ink/5 dark:bg-paper/10 px-3 py-1 rounded-full">
              #{t.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between hairline py-6 mt-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiked((l) => !l)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-sm border text-sm font-semibold transition-colors ${
              liked ? "border-crimson text-crimson" : "border-ink/15 dark:border-paper/15 hover:border-crimson"
            }`}
          >
            <FiHeart fill={liked ? "currentColor" : "none"} size={16} /> Like
          </button>
          <button
            onClick={() => toggleBookmark(news.slug)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-sm border text-sm font-semibold transition-colors ${
              isBookmarked(news.slug) ? "border-gold text-gold" : "border-ink/15 dark:border-paper/15 hover:border-gold"
            }`}
          >
            <FiBookmark fill={isBookmarked(news.slug) ? "currentColor" : "none"} size={16} /> Save
          </button>
        </div>
        <ShareButtons title={news.title} url={`/news/${news.slug}`} />
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display font-bold text-2xl mb-6">Related Articles</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {related.map((n) => <NewsCard key={n._id} news={n} />)}
          </div>
        </section>
      )}
    </article>
  );
};

export default NewsDetail;
