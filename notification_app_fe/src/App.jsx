import { useEffect, useState } from "react";
import axios from "axios";

const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function App() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const response = await axios.get(
        "http://localhost:3000/notifications"
      );

      const data = response.data || [];

      data.sort((a, b) => {
        const p1 = priorityMap[a.Type] || 0;
        const p2 = priorityMap[b.Type] || 0;

        if (p1 !== p2) return p2 - p1;

        return (
          new Date(b.Timestamp) -
          new Date(a.Timestamp)
        );
      });

      setNotifications(data.slice(0, 10));
    } catch (error) {
      console.error(
        "Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    type === "All"
      ? notifications
      : notifications.filter(
          (n) => n.Type === type
        );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Priority Notifications</h1>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "20px",
        }}
      >
        <option value="All">All</option>
        <option value="Placement">Placement</option>
        <option value="Result">Result</option>
        <option value="Event">Event</option>
      </select>

      {loading ? (
        <h3>Loading...</h3>
      ) : filtered.length === 0 ? (
        <h3>No notifications found</h3>
      ) : (
        filtered.map((item) => (
          <div
            key={item.ID}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              textAlign: "left",
            }}
          >
            <h3>{item.Type}</h3>

            <p>
              <strong>Message:</strong>{" "}
              {item.Message}
            </p>

            <p>
              <strong>ID:</strong>{" "}
              {item.ID}
            </p>

            <p>
              <strong>Timestamp:</strong>{" "}
              {item.Timestamp}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;