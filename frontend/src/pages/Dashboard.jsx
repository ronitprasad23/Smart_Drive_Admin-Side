import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

import Alerts from "./Alerts";
import AlertMap from "./AlertMap";
import Trips from "./Trips";
import Users from "./Users";
import Vehicles from "./Vehicles";
import AccidentZones from "./AccidentZones";
import Features from "./Features";
import AboutApp from "./AboutApp";
import Settings from "./Settings";
import ChangePassword from "./ChangePassword";
import Profile from "./Profile";

import { useEffect, useState } from "react";
import api from "../services/api";

function DashboardHome() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_alerts: 0,
    total_trips: 0,
    total_accident_zones: 0,
    recent_alerts: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const response = await api.get('/admin/dashboard/');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Admin Dashboard 👋</h2>

      {}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Alerts</h4>
          <p className="stat-number">{stats.total_alerts}</p>
        </div>

        <div className="stat-card">
          <h4>Total Users</h4>
          <p className="stat-number">{stats.total_users}</p>
        </div>

        <div className="stat-card">
          <h4>Accident Zones</h4>
          <p className="stat-number">{stats.total_accident_zones}</p>
        </div>

        <div className="stat-card">
          <h4>System Status</h4>
          <p className="status-ok">Running</p>
        </div>
      </div>

      {}
      <div className="card-section">
        <h3>Recent Alerts</h3>

        <table className="alert-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_alerts.length > 0 ? (
              stats.recent_alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.user}</td>
                  <td>{alert.type}</td>
                  <td>{alert.location}</td>
                  <td className={
                    alert.status === "Critical" ? "danger" :
                      alert.status === "Warning" ? "warning" : "safe"
                  }>
                    {alert.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No recent alerts</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        {}
        <Route path="/" element={<DashboardHome />} />

        {}
        <Route path="alerts" element={<Alerts />} />
        <Route path="alerts/map" element={<AlertMap />} />
        <Route path="trips" element={<Trips />} />
        <Route path="users" element={<Users />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="AccidentZones" element={<AccidentZones />} />
        <Route path="features" element={<Features />} />
        <Route path="about-app" element={<AboutApp />} />
        <Route path="settings" element={<Settings />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}