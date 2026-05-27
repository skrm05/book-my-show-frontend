import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import { Button } from "../components/ui/Button";

export const MainLayout: React.FC = () => {
  const { isAuthenticated, username, role } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand-dark border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter text-brand-crimson"
          >
            CINE<span className="text-white">PREMIUM</span>
          </Link>
          <nav className="flex items-center gap-4">
            {/* Dashboard Link for Admins */}
            {role === "ROLE_ADMIN" || role === "ROLE_THEATRE" ? (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-brand-gold hover:text-amber-400"
              >
                Dashboard
              </Link>
            ) : null}

            {/* Authentication UI Switch */}
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                {role === "ROLE_USER" && (
                  <>
                    <Link
                      to="/bookings"
                      className="text-sm font-medium text-neutral-300 hover:text-white"
                    >
                      Find Booking
                    </Link>
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-neutral-300 hover:text-white"
                    >
                      Profile
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-neutral-700">
                  <span className="text-sm text-brand-gold font-medium">
                    {username}
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="py-1 px-3 text-xs"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-neutral-700 hover:border-neutral-500 text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-brand-dark py-8 border-t border-neutral-800 text-center text-neutral-500 text-sm mt-auto">
        &copy; {new Date().getFullYear()} CinePremium. All rights reserved.
      </footer>
    </div>
  );
};
