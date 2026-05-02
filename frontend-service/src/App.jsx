import { useEffect, useState } from "react";

const emptyDashboard = {
  overview: null,
  consumption: null,
  simulation: null,
  realtime: null
};

function App() {
  const [credentials, setCredentials] = useState({ username: "demo.admin", password: "laragon123" });
  const [session, setSession] = useState(() => {
    const stored = window.localStorage.getItem("smart-energy-user");
    return stored ? JSON.parse(stored) : null;
  });
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      loadDashboard();
    }
  }, [session]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [overview, consumption, simulation, realtime] = await Promise.all([
        fetch("/api/dashboard/overview").then((response) => response.json()),
        fetch("/api/consumption/summary").then((response) => response.json()),
        fetch("/api/simulation/overview").then((response) => response.json()),
        fetch("/api/realtime/overview").then((response) => response.json())
      ]);

      setDashboard({ overview, consumption, simulation, realtime });
    } catch (loadError) {
      setError("Dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  // async function handleLogin(event) {
  //   event.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify(credentials)
  //     });

  //     if (!response.ok) {
  //       let message = "Login failed";
  //       try {
  //         const errorPayload = await response.json();
  //         message =
  //           errorPayload.message ||
  //           errorPayload.error ||
  //           JSON.stringify(errorPayload);
  //       } catch (_parseError) {
  //         message = await response.text();
  //       }
  //       throw new Error(message || "Login failed");
  //     }

  //     const result = await response.json();
  //     window.localStorage.setItem("smart-energy-user", JSON.stringify(result.user));
  //     setSession(result.user);
  //   } catch (loginError) {
  //     setError(loginError.message || "Login failed.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }
async function handleLogin(event) {
  event.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const raw = await response.text(); // ✅ read ONCE

    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = raw; // fallback if not JSON
    }

    if (!response.ok) {
      const message =
        (data && data.message) ||
        (data && data.error) ||
        raw ||
        "Login failed";

      throw new Error(message);
    }

    // success case
    const result = data;
    window.localStorage.setItem("smart-energy-user", JSON.stringify(result.user));
    setSession(result.user);

  } catch (loginError) {
    setError(loginError.message || "Login failed.");
  } finally {
    setLoading(false);
  }
}
  function handleLogout() {
    window.localStorage.removeItem("smart-energy-user");
    setSession(null);
    setDashboard(emptyDashboard);
    setError("");
  }

  if (!session) {
    return (
      <div className="app-shell auth-view">
        <div className="auth-card">
          <div>
            <p className="eyebrow">React Frontend + Spring Microservices</p>
            <h1>Smart Energy System</h1>
            <p className="lede">
              Sign in to access consumption analytics, home simulation, and real-time
              energy monitoring from a single dashboard.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Username
              <input
                type="text"
                value={credentials.username}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, username: event.target.value }))
                }
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="demo-note">
            <strong>Laragon demo account</strong>
            <span>`demo.admin` / `laragon123`</span>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell dashboard-view">
      <main className="dashboard-page">
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Dashboard Microservice + React UI</p>
            <h1>{dashboard.overview?.title ?? "Loading Dashboard..."}</h1>
            <p className="lede">
              {dashboard.overview?.subtitle ??
                "Preparing the overview returned by your backend microservices."}
            </p>
          </div>
          <div className="hero-actions">
            <div className="user-chip">
              <span>{session.displayName}</span>
              <small>{session.role}</small>
            </div>
            <button className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>

        {error ? <p className="error-text">{error}</p> : null}

        <section className="stats-grid">
          <article className="stat-card">
            <span>Budget</span>
            <strong>{dashboard.overview?.summary?.monthlyBudgetKwh ?? "-"} kWh</strong>
          </article>
          <article className="stat-card">
            <span>This Month</span>
            <strong>{dashboard.overview?.summary?.currentMonthKwh ?? "-"} kWh</strong>
          </article>
          <article className="stat-card">
            <span>Active Devices</span>
            <strong>{dashboard.overview?.summary?.activeDevices ?? "-"}</strong>
          </article>
          <article className="stat-card">
            <span>Alerts Today</span>
            <strong>{dashboard.overview?.summary?.alertsToday ?? "-"}</strong>
          </article>
        </section>

        <section className="section-grid">
          <article className="section-card">
            <h2>Consumption</h2>
            <p className="section-copy">
              Monthly energy view from the `consumption-service`.
            </p>
            <div className="mini-stats">
              <div>
                <span>Total</span>
                <strong>{dashboard.consumption?.totalKwh ?? "-"} kWh</strong>
              </div>
              <div>
                <span>Daily Avg</span>
                <strong>{dashboard.consumption?.averageDailyKwh ?? "-"}</strong>
              </div>
            </div>
            <div className="list-grid">
              {dashboard.consumption?.trend?.map((item) => (
                <div className="list-card" key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.kwh} kWh</span>
                </div>
              ))}
            </div>
          </article>

          <article className="section-card">
            <h2>Home Simulation</h2>
            <p className="section-copy">
              Usage planning and savings scenarios from the `simulation-service`.
            </p>
            <div className="mini-stats">
              <div>
                <span>Base Cost</span>
                <strong>${dashboard.simulation?.baseMonthlyCost ?? "-"}</strong>
              </div>
              <div>
                <span>Optimized</span>
                <strong>${dashboard.simulation?.recommendedMonthlyCost ?? "-"}</strong>
              </div>
            </div>
            <div className="list-grid">
              {dashboard.simulation?.scenarios?.map((item) => (
                <div className="list-card" key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.savingPercent}% saving</span>
                </div>
              ))}
            </div>
          </article>

          <article className="section-card">
            <h2>Real-Time Consumption</h2>
            <p className="section-copy">
              Live device load details from the `realtime-service`.
            </p>
            <div className="mini-stats">
              <div>
                <span>Current Load</span>
                <strong>{dashboard.realtime?.currentWatts ?? "-"} W</strong>
              </div>
              <div>
                <span>Grid</span>
                <strong>{dashboard.realtime?.gridStatus ?? "-"}</strong>
              </div>
            </div>
            <div className="list-grid">
              {dashboard.realtime?.devices?.map((device) => (
                <div className="list-card" key={device.name}>
                  <strong>{device.name}</strong>
                  <span>{device.room} - {device.watts} W</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
