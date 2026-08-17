import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { fetchNews, fetchCategories } from "../services/api";
import HeroSlider from "../components/HeroSlider";
import BreakingTicker from "../components/BreakingTicker";
import NewsCard from "../components/NewsCard";
import SectionHeader from "../components/SectionHeader";
import Newsletter from "../components/Newsletter";
import { CardSkeleton } from "../components/Loaders";

const CATS = ["Technology", "Politics", "Business", "Sports", "Education", "Health", "Entertainment", " News","World"];

const Home = () => {
  const [breaking, setBreaking] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [byCategory, setByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [breakingRes, featuredRes, latestRes, trendingRes, popularRes] = await Promise.all([
          fetchNews({ breaking: true, limit: 8 }),
          fetchNews({ featured: true, limit: 5 }),
          fetchNews({ limit: 8 }),
          fetchNews({ trending: true, limit: 6 }),
          fetchNews({ limit: 5, sort: "views" }),
        ]);
        setBreaking(breakingRes.data.news);
        setFeatured(featuredRes.data.news);
        setLatest(latestRes.data.news);
        setTrending(trendingRes.data.news);
        setPopular(popularRes.data.news);

        const { data: catData } = await fetchCategories();
        const catResults = {};
        await Promise.all(
          CATS.map(async (catName) => {
            const match = catData.categories.find((c) => c.name === catName);
            if (!match) {
              catResults[catName] = [];
              return;
            }
            try {
              const { data } = await fetchNews({ limit: 4, category: match._id });
              catResults[catName] = data.news;
            } catch {
              catResults[catName] = [];
            }
          })
        );
        setByCategory(catResults);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="pb-12">
      <Helmet>
        <title>The Daily Wire Desk — Breaking News, Politics, Business & More</title>
        <meta name="description" content="Breaking news, politics, business, sports, technology and world news — reported fast, fact-checked always." />
      </Helmet>

      <BreakingTicker items={breaking} />

      <div className="py-6">
        {loading ? (
          <div className="h-[420px] md:h-[560px] bg-ink/5 dark:bg-paper/5 rounded-sm animate-pulse" />
        ) : (
          <HeroSlider slides={featured.length ? featured : latest.slice(0, 5)} />
        )}
      </div>

      {/* Latest News + Popular sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <SectionHeader eyebrow="Just In" title="Latest News" viewAllLink="/category/latest" />
          <div className="grid sm:grid-cols-2 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : latest.map((n) => <NewsCard key={n._id} news={n} />)}
          </div>
        </div>

        <aside>
          <SectionHeader eyebrow="Right Now" title="Most Viewed" />
          <div className="space-y-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-ink/5 dark:bg-paper/5 rounded animate-pulse" />)
              : popular.map((n, i) => (
                  <div key={n._id} className="flex gap-3 items-start">
                    <span className="font-display font-bold text-2xl text-crimson/70 w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <NewsCard news={n} variant="horizontal" />
                  </div>
                ))}
          </div>
        </aside>
      </section>

      {/* Trending */}
      <section>
        <SectionHeader eyebrow="Editor's Picks" title="Trending Now" viewAllLink="/category/trending" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : trending.map((n) => <NewsCard key={n._id} news={n} />)}
        </div>
      </section>

      <Newsletter />

      {/* Category sections */}
      {CATS.map((cat) => (
        <section key={cat}>
          <SectionHeader
            eyebrow="Section"
            title={cat}
            viewAllLink={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : (byCategory[cat] || []).map((n) => <NewsCard key={n._id} news={n} />)}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;
