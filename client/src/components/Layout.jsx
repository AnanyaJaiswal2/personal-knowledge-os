import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Library" },
    { path: "/ask", label: "Ask Knowledge" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-60 bg-gray-900/60 border-r border-gray-800 flex flex-col px-4 py-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 mb-1 px-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-xs">
            K
          </div>
          <span className="font-bold text-white">Knowledge OS</span>
        </Link>
        <p className="text-xs text-gray-500 px-2 mb-8">
          Capture · Connect · Learn
        </p>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(item.path)
                  ? "bg-violet-600/15 text-violet-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-3 py-2 text-sm text-gray-500 hover:text-gray-300 text-left transition"
        >
          Log out
        </button>
      </aside>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 px-10 py-8 max-w-4xl"
      >
        {children}
      </motion.main>
    </div>
  );
}

export default Layout;