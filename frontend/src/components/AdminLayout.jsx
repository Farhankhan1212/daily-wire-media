import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiGrid, FiFileText, FiPlusCircle, FiTag, FiLogOut, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/news", label: "Manage News", icon: FiFileText },
  { to: "/admin/news/new", label: "Add News", icon: FiPlusCircle },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
];

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-paper dark:bg-ink">
      <aside className="w-64 shrink-0 border-r border-ink/10 dark:border-paper/10 p-6 hidden md:flex md:flex-col">
        <h2 className="font-display font-bold text-xl mb-1">
          Wire Desk <span className="text-crimson">Admin</span>
        </h2>
        <p className="dateline mb-8">{admin?.name}</p>

        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors ${
                  isActive ? "bg-crimson text-white" : "hover:bg-ink/5 dark:hover:bg-paper/5"
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-crimson mb-3">
          <FiExternalLink size={16} /> View site
        </a>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-crimson">
          <FiLogOut size={16} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
