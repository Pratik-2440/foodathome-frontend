import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  // 🔴 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">

      {/* ===== LEFT SIDEBAR ===== */}
      <div className="sidebar">
        <h2 className="logo">FoodAtHome</h2>

        <ul className="menu">
          <li>Dashboard</li>
          <li>My Orders</li>
          <li>Profile</li>
          <li>Address</li>
          <li>Settings</li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content">
        <h1>Welcome to FoodAtHome 🍔</h1>
        <p>User dashboard is ready.</p>
      </div>

    </div>
  );
}
