import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiSearch, FiMenu, FiX, FiBookmark } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { searchSuggestions, aiSearch } from "../services/api";

const categories = [
  "Technology", "Politics", "Business", "Sports", "Education", "Health", "Entertainment", "World",
];

const Navbar = () => {
  const { dark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim().length > 1) {
        try {
          const { data } = await searchSuggestions(query);
          setSuggestions(data.suggestions);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setSuggestions([]);
    }
  };

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-paper/95 dark:bg-ink/95 backdrop-blur border-b border-ink/10 dark:border-paper/10">
      {/* Top utility bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-[11px] font-mono tracking-wider uppercase text-slate-650 dark:text-paper-dim/60 border-b border-ink/5 dark:border-paper/5">
        <span>{dateStr}</span>
        <div className="flex items-center gap-4">
          <Link to="/bookmarks" className="flex items-center gap-1 hover:text-crimson"><FiBookmark size={12}/> Saved</Link>
          <Link to="/admin/login" className="hover:text-crimson">Admin</Link>
        </div>
      </div>

      {/* Masthead */}
      <div className="flex items-center justify-between px-6 py-4">
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <Link to="/" className="mx-auto md:mx-0 text-center md:text-left">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            The Daily <span className="text-crimson">Wire Desk</span>
          </h1>
          <p className="dateline mt-0.5 hidden md:block">Independent · Fact-Checked · Since 2026</p>
        </Link>

        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="p-2 hover:text-crimson">
            <FiSearch size={20} />
          </button>
          <button onClick={toggle} aria-label="Toggle theme" className="p-2 hover:text-crimson">
            {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="px-6 pb-4 relative">
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search headlines, topics, authors…"
              className="input-field"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
          {suggestions.length > 0 && (
            <div className="max-w-xl mx-auto bg-paper dark:bg-ink-soft border border-ink/10 dark:border-paper/10 mt-1 rounded-sm shadow-lg">
              {suggestions.map((s) => (
                <Link
                  key={s._id}
                  to={`/news/${s.slug}`}
                  onClick={() => { setSearchOpen(false); setQuery(""); setSuggestions([]); }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-crimson/5 text-sm"
                >
                  {s.image?.url && <img src={s.image.url} alt="" className="w-10 h-10 object-cover rounded-sm" />}
                  <span>{s.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category nav */}
      <nav className={`hairline ${menuOpen ? "block" : "hidden md:block"}`}>
        <ul className="flex flex-col md:flex-row md:items-center md:justify-center gap-x-7 gap-y-1 px-6 py-2 text-sm font-semibold uppercase tracking-wide">
          {categories.map((cat) => (
            <li key={cat}>
              <NavLink
                to={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `hover:text-crimson transition-colors ${isActive ? "text-crimson" : ""}`
                }
              >
                {cat}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
