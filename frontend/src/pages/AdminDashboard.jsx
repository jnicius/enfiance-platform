import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Admin stats error:", err);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Admin users error:", err);
    }
  };

  if (!stats) {
    return (
      <div style={{ padding: "20px" }}>
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Enfiance Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <h2>{stats.users}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Wallets</h3>
          <h2>{stats.wallets}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Transactions</h3>
          <h2>{stats.transactions}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Pending Requests</h3>
          <h2>{stats.pendingRequests}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Platform Balance</h3>
          <h2>${stats.totalBalance}</h2>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>
        Recent Users
      </h2>

      <table
        style={{
          width: "100%",
          background: "white",
          color: "black",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Wallet</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>${user.balance}</td>
              <td>
                {user.wallet?.address
                  ? user.wallet.address.slice(0, 10) + "..."
                  : "No Wallet"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fff",
  color: "#000",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
