import { useEffect, useState } from "react";

function RealtimePage({ session }) {
  const [appliances, setAppliances] = useState([]);
  const [load, setLoad] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch(`/api/realtime/appliances/${session.id || 1}`);
      if (!res.ok) {
        throw new Error('Backend not available');
      }
      const data = await res.json();
      setAppliances(data);

      const loadRes = await fetch(`/api/realtime/load/${session.id || 1}`);
      if (!loadRes.ok) {
        throw new Error('Backend not available');
      }
      setLoad(await loadRes.json());
    } catch (error) {
      // Mock data for testing without backend
      setAppliances([
        { id: 1, name: "Refrigerator", watts: 150, status: true },
        { id: 2, name: "Air Conditioner", watts: 2000, status: false },
        { id: 3, name: "Washing Machine", watts: 500, status: false }
      ]);
      setLoad(150);
    }
  }

  async function toggle(id) {
    try {
      await fetch(`/api/realtime/appliances/${id}/toggle`, {
        method: "PUT"
      });
    } catch (error) {
      // Mock toggle for testing without backend
      console.log(`Mock toggle appliance ${id}`);
    }
    loadData();
  }

  return (
    <div className="container">
      <h2>Real-Time Monitoring</h2>

      <h3>Current Load: {load} W</h3>

      {appliances.map(a => (
        <div className="card" key={a.id}>
          <h4>{a.name}</h4>
          <p>{a.watts}W</p>

          <button className="button" onClick={() => toggle(a.id)}>
            {a.status ? "Turn OFF" : "Turn ON"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default RealtimePage;