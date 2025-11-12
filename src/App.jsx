import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

const ProtectedRoute = ({ children }) => {
  const userId = sessionStorage.getItem("userId");

  return userId ? children : <Navigate to="/login" />;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (userId) {
      getUserById(parseInt(userId)).then((userData) => {
        if (userData) {
          setUser(userData);
        }
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Nav user={user} setUser={setUser} />
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
