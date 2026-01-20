import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Nav from "./components/Nav";
import Splash from "./pages/Splash";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import Airtime from "./pages/Airtime";
import Bills from "./pages/Bills";
import { getUserById } from "./utils/api";
import { toast } from "react-toastify";


const SESSION_TIMEOUT = 3 * 60 * 1000; 
const IDLE_CHECK_INTERVAL = 60000; 

const ProtectedRoute = ({ children }) => {
  const userId = sessionStorage.getItem("userId");
  const lastActivityRef = useRef(Date.now());
  const timeoutRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("lastActivity");
    toast.info("Session timeout: Please login again", {
      autoClose: 5000,
    });
    navigate("/login");
    window.location.reload();
  }, [navigate]);

  const resetActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    sessionStorage.setItem("lastActivity", now.toString());

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
  }, [logout]);

  useEffect(() => {
    if (!userId) return;

    // Initialize last activity from storage or current time
    const savedActivity = sessionStorage.getItem("lastActivity");
    lastActivityRef.current = savedActivity
      ? parseInt(savedActivity, 10)
      : Date.now();

    // Set up activity listeners
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => {
      document.addEventListener(event, resetActivity, true);
    });

    // Check for visibility changes (tab/window focus)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, don't reset activity
      } else {
        // Tab is visible again, check if session expired
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;

        if (timeSinceLastActivity >= SESSION_TIMEOUT) {
          logout();
        } else {
          resetActivity();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Periodic check for idle timeout
    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        logout();
      }
    }, IDLE_CHECK_INTERVAL);

    // Set initial timeout
    resetActivity();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetActivity, true);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [userId, resetActivity, logout]);

  return userId ? children : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };


  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (userId) {
      getUserById(userId).then((userData) => {
        if (userData) {
          setUser(userData);
        }
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Nav user={user} setUser={setUser} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/airtime"
            element={
              <ProtectedRoute>
                <Airtime />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <Bills />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
