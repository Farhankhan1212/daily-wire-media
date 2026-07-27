import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { getDashboardStats } from "../../services/api";
import { Spinner } from "../../components/Loaders";

const CARD_LABELS = [
  ["totalNews", "Total News"],
  ["breakingNews", "Breaking News"],
  ["featuredNews", "Featured News"],
  ["draftNews", "Draft News"],
  ["publishedNews", "Published News"],
  ["categoriesCount", "Categories"],
  ["expiredNews", "Expired News"],
  ["autoDeletedCount", "Auto Deleted"],
];

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(({ data }) => setStats(data)).catch(console.error);
  }, []);

  if (!stats) return <Spinner />;

  const monthlyData = stats.charts.monthlyPublished.map((m) => ({
    name: `${monthNames[m._id.month - 1]} '${String(m._id.year).slice(2)}`,
    count: m.count,
  }));

  return (
    <div>
      <Helmet><title>Dashboard — Admin</title></Helmet>
      <h1 className="font-display font-bold text-3xl mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CARD_LABELS.map(([key, label]) => (
          <div key={key} className="border border-ink/10 dark:border-paper/10 rounded-sm p-4">
            <p className="dateline mb-2">{label}</p>
            <p className="font-display font-extrabold text-3xl">{stats.cards[key]}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-ink/10 dark:border-paper/10 rounded-sm p-5">
          <h3 className="font-semibold mb-4">News per Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.charts.perCategory}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#C81E2C" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ink/10 dark:border-paper/10 rounded-sm p-5">
          <h3 className="font-semibold mb-4">Monthly Published News</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#B98900" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-ink/10 dark:border-paper/10 rounded-sm p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Top Trending Articles</h3>
          <ul className="divide-y divide-ink/5 dark:divide-paper/5">
            {stats.charts.trendingArticles.map((a, i) => (
              <li key={a._id} className="py-3 flex items-center justify-between text-sm">
                <span>{i + 1}. {a.title}</span>
                <span className="dateline">{a.views} views</span>
              </li>
            ))}
            {stats.charts.trendingArticles.length === 0 && (
              <p className="text-sm text-slate-650 py-3">No trending articles marked yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
