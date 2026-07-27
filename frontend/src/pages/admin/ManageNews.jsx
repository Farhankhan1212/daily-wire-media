import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { fetchNews, deleteNews } from "../../services/api";
import { Spinner } from "../../components/Loaders";

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchNews({ all: true, page, limit: 15 });
      setNews(data.news);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteNews(id);
    load();
  };

  return (
    <div>
      <Helmet><title>Manage News — Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl">Manage News</h1>
        <Link to="/admin/news/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add News
        </Link>
      </div>

      {loading ? <Spinner /> : (
        <div className="overflow-x-auto border border-ink/10 dark:border-paper/10 rounded-sm">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 dark:bg-paper/5 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Flags</th>
                <th className="p-3">Expiry</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n._id} className="border-t border-ink/5 dark:border-paper/5">
                  <td className="p-3 max-w-xs truncate font-medium">{n.title}</td>
                  <td className="p-3">{n.category?.name}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      n.status === "published" ? "bg-green-600/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"
                    }`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-1">
                    {n.breaking && <span className="text-xs font-bold text-crimson">BREAKING</span>}
                    {n.featured && <span className="text-xs font-bold text-gold">FEATURED</span>}
                    {n.trending && <span className="text-xs font-bold text-blue-600">TRENDING</span>}
                  </td>
                  <td className="p-3 dateline">
                    {n.expiryDate ? new Date(n.expiryDate).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/news/edit/${n._id}`} className="p-2 hover:text-crimson"><FiEdit2 size={15} /></Link>
                      <button onClick={() => handleDelete(n._id, n.title)} className="p-2 hover:text-crimson"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {news.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-slate-650">No news articles yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-sm text-sm font-semibold ${
                page === i + 1 ? "bg-crimson text-white" : "border border-ink/15 dark:border-paper/15"
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

export default ManageNews;
