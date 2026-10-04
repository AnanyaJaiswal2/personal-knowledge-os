import { Link, useNavigate, useLocation } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="font-bold text-lg text-gray-900">
          🧠 Knowledge OS
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`text-sm font-medium ${
              isActive("/dashboard") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Library
          </Link>
          <Link
            to="/ask"
            className={`text-sm font-medium ${
              isActive("/ask") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Ask Knowledge
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Log out
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

export default Layout;