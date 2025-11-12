import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Nav = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (location.pathname === "/login" || location.pathname === "/signup")
    return null;

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="bg-purple-600 text-white rounded-md w-10 h-10 flex items-center justify-center font-bold">
            MW
          </div>
          <span className="font-semibold">M-Wallet</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              className="text-sm text-gray-700"
            >
              {nav.label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} className="text-sm text-red-600">
              Logout
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-3">
          {navLinks.map((nav) => (
            <Link key={nav.path} to={nav.path} className="block py-2">
              {nav.label}
            </Link>
          ))}
          {user && (
            <button onClick={handleLogout} className="block py-2 text-red-600">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
