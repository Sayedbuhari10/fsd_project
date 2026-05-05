import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function AnalyticsPage({ session }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/consumption/analytics/${session.id || 1}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Backend not available');
        }
        return res.json();
      })
      .then(setData)
      .catch(error => {
        // Mock data for testing without backend
        setData({
          currentLoad: 350,
          monthlyKwh: 320.5,
          bill: 2100.75
        });
      });
  }, []);

  const chartData = [
    { name: "Week 1", load: 50 },
    { name: "Week 2", load: 120 },
    { name: "Week 3", load: 90 },
    { name: "Week 4", load: 140 }
  ];

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Energy Analytics</h2>

      <div className="grid">
        <div className="card">
          <h3>Current Load</h3>
          <p>{data.currentLoad} W</p>
        </div>

        <div className="card">
          <h3>Monthly Usage</h3>
          <p>{data.monthlyKwh.toFixed(2)} kWh</p>
        </div>

        <div className="card">
          <h3>Estimated Bill</h3>
          <p>₹ {data.bill.toFixed(2)}</p>
        </div>
      </div>

      <div className="card">
        <h3>Usage Trend</h3>

        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="load" stroke="#0ea5e9" />
        </LineChart>
      </div>
    </div>
  );
}

export default AnalyticsPage;