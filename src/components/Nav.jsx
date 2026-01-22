import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Nav = ({ user, setUser, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/signup")
    return null;

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("lastActivity");
    if (setUser) setUser(null);
    navigate("/login");
  };

  const navLinks = user
    ? [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/transfer", label: "Transfer" },
        { path: "/airtime", label: "Airtime" },
        { path: "/bills", label: "Bills" },
      ]
    : [
        { path: "/login", label: "Login" },
        { path: "/signup", label: "Sign Up" },
      ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-purple-900/10 ">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="bg-purple-600 text-white rounded-md w-10 h-10 flex items-center justify-center font-bold">
            MW
          </div>
          <span className="font-semibold text-black dark:text-white">M-Wallet</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-2xl bg-purple-300 dark:bg-purple-600 px-4 py-2"
            >
              {nav.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={toggleDarkMode}
              className={`text-sm p-2 rounded ${
                darkMode ? "text-yellow-400 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
              }`}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          )}
          {user && (
           <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {user && (
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded ${darkMode ? "text-yellow-400" : "text-gray-700"}`}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          )}
          <button
            className={darkMode ? "text-white" : "text-gray-700"}
            onClick={() => setIsOpen(!isOpen)}
          >

            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-3 bg-purple-50 dark:bg-gray-700">
          {navLinks.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              className="block py-2 dark:text-gray-300"
            >
              {nav.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="block py-2 text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
