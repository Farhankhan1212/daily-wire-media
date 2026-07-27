import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchNews, fetchCategories } from "../services/api";
import NewsCard from "../components/NewsCard";
import SectionHeader from "../components/SectionHeader";
import { CardSkeleton } from "../components/Loaders";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortAuthor, setSortAuthor] = useState("");

  useEffect(() => {
    setPage(1);
  }, [slug]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data: catData } = await fetchCategories();
        const match = catData.categories.find((c) => c.slug === slug);
        setCategory(match || { name: slug.replace(/-/g, " ") });

        const params = { page, limit: 12 };
        if (match) params.category = match._id;
        if (sortAuthor) params.author = sortAuthor;

        const { data } = await fetchNews(params);
        setNews(data.news);
        setPages(data.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, page, sortAuthor]);

  return (
    <div className="py-8">
      <Helmet>
        <title>{category?.name || "Category"} — The Daily Wire Desk</title>
      </Helmet>

      <SectionHeader eyebrow="Section" title={category?.name || slug} />

      <div className="mb-6">
        <input
          value={sortAuthor}
          onChange={(e) => setSortAuthor(e.target.value)}
          placeholder="Filter by author…"
          className="input-field max-w-xs"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : news.length
          ? news.map((n) => <NewsCard key={n._id} news={n} />)
          : <p className="col-span-full text-center text-slate-650 py-16">No articles found in this section yet.</p>}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-sm text-sm font-semibold ${
                page === i + 1 ? "bg-crimson text-white" : "border border-ink/15 dark:border-paper/15 hover:border-crimson"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
