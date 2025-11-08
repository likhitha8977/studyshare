import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-violet-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:text-violet-100"
          >
            📚 ShareNotes
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/notes"
              className="text-white hover:text-violet-200 font-medium"
            >
              Browse Notes
            </Link>

            {user ? (
              <>
                <Link
                  to="/upload"
                  className="text-white hover:text-violet-200 font-medium"
                >
                  Upload Notes
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:text-violet-200 font-medium"
                >
                  My Profile
                </Link>
                <span className="text-violet-100">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-violet-700 bg-white rounded-md hover:bg-violet-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-violet-700 bg-white rounded-md hover:bg-violet-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-800 rounded-md hover:bg-violet-900 border-2 border-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
