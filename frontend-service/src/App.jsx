import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import AnalyticsPage from "./AnalyticsPage";
import SimulationPage from "./SimulationPage";
import RealtimePage from "./RealtimePage";

function App() {
  const [session, setSession] = useState(null);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  // ✅ SAFE SESSION RESTORE (FIXED)
useEffect(() => {
  const saved = localStorage.getItem("smart-energy-user");

  if (saved && saved !== "undefined") {
    try {
      setSession(JSON.parse(saved));
    } catch (e) {
      console.error("Invalid JSON in localStorage");
      localStorage.removeItem("smart-energy-user");
    }
  }
}, []);

  async function handleLogin(e) {
    e.preventDefault();

    // Try real authentication first (for database users)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("smart-energy-user", JSON.stringify(data.user));
        setSession(data.user);
        navigate("/");
        return;
      }
    } catch (error) {
      console.log("Backend not available, trying mock authentication");
    }

    // FALLBACK: Mock authentication for testing without backend
    if (credentials.username === "demo.admin" && credentials.password === "laragon123") {
      const mockData = {
        user: {
          id: 1,
          username: "demo.admin",
          displayName: "Demo Admin",
          role: "HOME_OWNER"
        }
      };
      
      localStorage.setItem("smart-energy-user", JSON.stringify(mockData.user));
      setSession(mockData.user);
      navigate("/");
      return;
    }

    // If we reach here, authentication failed
    alert("Invalid credentials. Try demo.admin / laragon123 or check your database credentials");
  }

  function handleLogout() {
    localStorage.removeItem("smart-energy-user");
    setSession(null);
  }

  // 🔐 LOGIN UI (UPGRADED)
  if (!session) {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Smart Energy</h2>

          <input
            placeholder="Username"
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <button className="button">Login</button>
        </form>
      </div>
    );
  }

  // ✅ MAIN APP UI (INDUSTRY STYLE)
  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>⚡ Energy</h2>

        <nav>
          <div onClick={() => navigate("/")}>Dashboard</div>
          <div onClick={() => navigate("/analytics")}>Analytics</div>
          <div onClick={() => navigate("/simulation")}>Simulation</div>
          <div onClick={() => navigate("/realtime")}>Realtime</div>
        </nav>
      </div>

      {/* Main Area */}
      <div className="main">
        {/* Navbar */}
        <div className="navbar">
          <h3>Smart Energy Dashboard</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <input placeholder="Search..." />
            <button className="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard navigate={navigate} />} />
            <Route
              path="/analytics"
              element={<AnalyticsPage session={session} />}
            />
            <Route
              path="/simulation"
              element={<SimulationPage session={session} />}
            />
            <Route
              path="/realtime"
              element={<RealtimePage session={session} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// ✅ DASHBOARD (UI IMPROVED ONLY)
function Dashboard({ navigate }) {
  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Overview</h2>

      <div className="grid">
        <div className="card" onClick={() => navigate("/analytics")}>
          <h3>Analytics</h3>
          <p>Monthly Usage: 320 kWh</p>
          <p>Estimated Bill: ₹2100</p>
        </div>

        <div className="card" onClick={() => navigate("/simulation")}>
          <h3>Simulation</h3>
          <p>Appliances: 5</p>
          <p>Total Capacity: 1200W</p>
        </div>

        <div className="card" onClick={() => navigate("/realtime")}>
          <h3>Realtime</h3>
          <p>Current Load: 350W</p>
          <p>Status: Active</p>
        </div>
      </div>
    </div>
  );
}

export default App;