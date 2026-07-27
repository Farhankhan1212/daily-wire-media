import { Link } from "react-router-dom";
import { FiBookmark, FiClock } from "react-icons/fi";
import { useBookmarks } from "../context/BookmarkContext";

const NewsCard = ({ news, variant = "default" }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(news.slug);

  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 group">
        <Link to={`/news/${news.slug}`} className="shrink-0 w-28 h-20 md:w-36 md:h-24 overflow-hidden rounded-sm">
          <img
            src={news.image?.url || "https://placehold.co/300x200?text=News"}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="dateline mb-1">{news.category?.name} · {news.readingTime || 3} min read</p>
          <Link to={`/news/${news.slug}`}>
            <h3 className="font-display font-semibold leading-snug group-hover:text-crimson transition-colors line-clamp-2">
              {news.title}
            </h3>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="group card-shadow bg-white/50 dark:bg-ink-soft/50 rounded-sm overflow-hidden flex flex-col h-full">
      <Link to={`/news/${news.slug}`} className="block overflow-hidden aspect-[16/10]">
        <img
          src={news.image?.url || "https://placehold.co/600x375?text=News"}
          alt={news.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="dateline text-crimson">{news.category?.name}</span>
          <button
            onClick={() => toggleBookmark(news.slug)}
            aria-label="Bookmark article"
            className={bookmarked ? "text-gold" : "text-ink/30 dark:text-paper/30 hover:text-gold"}
          >
            <FiBookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        <Link to={`/news/${news.slug}`}>
          <h3 className="font-display font-bold text-lg leading-snug mb-2 group-hover:text-crimson transition-colors line-clamp-2">
            {news.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-650 dark:text-paper-dim/70 line-clamp-2 mb-3">{news.description}</p>
        <div className="mt-auto flex items-center justify-between text-xs dateline">
          <span>{news.author}</span>
          <span className="flex items-center gap-1"><FiClock size={11} /> {news.readingTime || 3} min</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
