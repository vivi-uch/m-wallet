import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Wallet, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  LayoutDashboard, 
  Send, 
  Smartphone, 
  Receipt,
  UserPlus,
  LogIn
} from "lucide-react";

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
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = user
    ? [
        { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { path: "/transfer", label: "Transfer", icon: <Send className="w-4 h-4" /> },
        { path: "/airtime", label: "Airtime", icon: <Smartphone className="w-4 h-4" /> },
        { path: "/bills", label: "Bills", icon: <Receipt className="w-4 h-4" /> },
      ]
    : [
        { path: "/login", label: "Login", icon: <LogIn className="w-4 h-4" /> },
        { path: "/signup", label: "Sign Up", icon: <UserPlus className="w-4 h-4" /> },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">

        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 group"
        >
          <div className="bg-linear-to-tr from-purple-600 to-indigo-600 text-white rounded-xl w-10 h-10 flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform duration-200">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
            M-Wallet
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive(nav.path)
                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              {nav.icon}
              {nav.label}
            </Link>
          ))}

          {user && (
            <>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold ml-2 px-4 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
             <button
            onClick={toggleDarkMode}
            className="p-2 ml-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>
          </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1 shadow-inner animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((nav) => (
            <Link
              key={nav.path}
              to={nav.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                isActive(nav.path)
                  ? "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span className={isActive(nav.path) ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}>
                {nav.icon}
              </span>
              {nav.label}
            </Link>
          ))}
          
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
