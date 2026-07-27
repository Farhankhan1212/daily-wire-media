import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchNews } from "../services/api";
import NewsCard from "../components/NewsCard";
import SectionHeader from "../components/SectionHeader";
import { CardSkeleton } from "../components/Loaders";

const SearchResults = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchNews({ search: q, limit: 20 });
        setNews(data.news);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (q) load();
    else setLoading(false);
  }, [q]);

  return (
    <div className="py-8">
      <Helmet><title>Search: {q} — The Daily Wire Desk</title></Helmet>
      <SectionHeader eyebrow="Search Results" title={`"${q}"`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : news.length
          ? news.map((n) => <NewsCard key={n._id} news={n} />)
          : <p className="col-span-full text-center text-slate-650 py-16">No results found for "{q}".</p>}
      </div>
    </div>
  );
};

export default SearchResults;
