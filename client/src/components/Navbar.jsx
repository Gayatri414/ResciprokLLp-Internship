import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1120]/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm shadow-glow-sm">J</span>
          JobSphere
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {isLanding && (
            <>
              <button type="button" onClick={() => scrollTo("features")} className="btn-ghost text-sm hidden sm:inline-flex">Features</button>
              <button type="button" onClick={() => scrollTo("pricing")} className="btn-ghost text-sm hidden sm:inline-flex">Pricing</button>
            </>
          )}
          <Link to="/jobs" className="btn-ghost text-sm">Browse Jobs</Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === "company" ? (
                <>
                  <Link to="/dashboard/company" className="btn-ghost text-sm">Dashboard</Link>
                  <Link to="/dashboard/company/post-job" className="btn-primary text-sm py-2 px-4">Post Job</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
                  <Link to="/dashboard/applications" className="btn-ghost text-sm">Applications</Link>
                </>
              )}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <span className="text-sm text-slate-400 hidden sm:inline">{user?.name}</span>
                <button type="button" onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-400 transition">Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
