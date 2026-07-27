import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.success) navigate("/admin/dashboard");
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-ink px-6">
      <Helmet><title>Admin Login — The Daily Wire Desk</title></Helmet>
      <div className="w-full max-w-sm">
        <h1 className="font-display font-extrabold text-2xl text-center mb-1">
          The Daily <span className="text-crimson">Wire Desk</span>
        </h1>
        <p className="dateline text-center mb-8">Admin Console</p>

        <form onSubmit={handleSubmit} className="space-y-4 border border-ink/10 dark:border-paper/10 p-6 rounded-sm">
          <div>
            <label className="text-sm font-semibold block mb-1">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="[email protected]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="••••••••"
            />
          </div>
          {error && <p className="text-crimson text-sm">{error}</p>}
          <button disabled={loading} type="submit" className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
