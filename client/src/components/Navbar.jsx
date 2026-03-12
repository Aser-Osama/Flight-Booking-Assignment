import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-rose-100 shadow-sm w-full">
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex justify-between items-center">
        <Link
          to="/"
          className="text-rose-600 font-semibold tracking-tight text-2xl transition-colors hover:text-rose-500"
        >
          Flight Booking System
        </Link>

        <div className="flex items-center gap-5">
          {token ? (
            <>
              <Link
                to="/profile"
                className="text-base font-medium text-gray-600 hover:text-rose-500 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/bookings"
                className="text-base font-medium text-gray-600 hover:text-rose-500 transition-colors"
              >
                My Bookings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm border border-rose-300 text-rose-500 hover:bg-rose-50 rounded-md px-3 py-1.5 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-base font-medium text-gray-600 hover:text-rose-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-base font-medium text-gray-600 hover:text-rose-500 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;