import { useEffect, useState } from "react";

function SimulationPage({ session }) {
  const userId = session?.id || 1;

  const [name, setName] = useState("");
  const [watts, setWatts] = useState("");
  const [appliances, setAppliances] = useState([]);

  useEffect(() => {
    loadAppliances();
  }, []);

  async function loadAppliances() {
    try {
      const res = await fetch(`/api/simulation/appliances/${userId}`);
      if (!res.ok) {
        throw new Error('Failed to load appliances');
      }
      const data = await res.json();
      setAppliances(data);
    } catch (error) {
      console.error('Error loading appliances:', error);
      setAppliances([]);
    }
  }

  async function addAppliance() {
    try {
      const res = await fetch("/api/simulation/appliances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          name,
          watts: parseFloat(watts)
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to add appliance');
      }
      
      setName("");
      setWatts("");
      loadAppliances();
    } catch (error) {
      console.error('Error adding appliance:', error);
    }
  }

  return (
    <div className="container">
      <h2>Home Simulation</h2>

      <div className="card">
        <input
          placeholder="Appliance"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Watts"
          value={watts}
          onChange={(e) => setWatts(e.target.value)}
        />

        <button className="button" onClick={addAppliance}>
          Add Appliance
        </button>
      </div>

      {appliances.map(a => (
        <div className="card" key={a.id}>
          {a.name} — {a.watts}W
        </div>
      ))}
    </div>
  );
}

export default SimulationPage;