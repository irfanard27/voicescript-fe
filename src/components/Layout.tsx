import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-bold">⚖️ CourtReporter</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} className="button-secondary">
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64 bg-transparent text-gray-800 flex flex-col p-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200"
            >
              📋 Dashboard
            </Link>
            <Link
              to="/jobs/new"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-200"
            >
              ➕ New Job
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
