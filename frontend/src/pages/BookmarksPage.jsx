import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useBookmarks } from "../context/BookmarkContext";
import { fetchNewsBySlug } from "../services/api";
import NewsCard from "../components/NewsCard";
import SectionHeader from "../components/SectionHeader";
import { CardSkeleton } from "../components/Loaders";

const BookmarksPage = () => {
  const { bookmarks } = useBookmarks();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          bookmarks.map((slug) => fetchNewsBySlug(slug).then((r) => r.data.news).catch(() => null))
        );
        setNews(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    };
    if (bookmarks.length) load();
    else {
      setNews([]);
      setLoading(false);
    }
  }, [bookmarks]);

  return (
    <div className="py-8">
      <Helmet><title>Saved Articles — The Daily Wire Desk</title></Helmet>
      <SectionHeader eyebrow="Your Library" title="Saved Articles" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[200px]">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          : news.length
          ? news.map((n) => <NewsCard key={n._id} news={n} />)
          : <p className="col-span-full text-center text-slate-650 py-16">You haven't saved any articles yet.</p>}
      </div>
    </div>
  );
};

export default BookmarksPage;
