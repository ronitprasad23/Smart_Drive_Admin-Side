import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaInfoCircle } from "react-icons/fa";
import {
  FiActivity,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [activeTab, setActiveTab] = useState("generated");
  const [alertTypes, setAlertTypes] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    moderate: 0,
    minor: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchAlerts();
    fetchAlertTypes();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/admin/alerts/");
      const data = response.data;
      setAlerts(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertTypes = async () => {
    try {
      const response = await api.get("/admin/alert-types/");
      setAlertTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch alert types", error);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    // Check both display name (from new serializer) and raw value (for backward compatibility/safety)
    const critical = data.filter(
      (a) =>
        a.severity_display === "Critical Risk" ||
        a.severity === "CRITICAL_RISK" ||
        a.severity === "CRITICAL" ||
        a.severity === "HIGH",
    ).length;
    const moderate = data.filter(
      (a) =>
        a.severity_display === "Moderate Risk" ||
        a.severity === "MODERATE_RISK" ||
        a.severity === "MEDIUM",
    ).length;
    const minor = data.filter(
      (a) =>
        a.severity_display === "Minor Risk" ||
        a.severity === "MINOR_RISK" ||
        a.severity === "LOW",
    ).length;
    const resolved = data.filter((a) => a.is_resolved).length;

    setStats({ total, critical, moderate, minor, resolved });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Alerts Management 🚨
        </h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Alerts</h4>
          <p className="stat-number">{stats.total}</p>
        </div>

        <div className="stat-card">
          <h4>Critical Risk</h4>
          <p className="stat-number danger">{stats.critical}</p>
        </div>

        <div className="stat-card">
          <h4>Moderate Risk</h4>
          <p className="stat-number warning">{stats.moderate}</p>
        </div>

        <div className="stat-card">
          <h4>Minor Risk</h4>
          <p className="stat-number safe">{stats.minor}</p>
        </div>
      </div>

      <div className="tabs flex gap-4 border-b border-white/5 mb-8">
        <button
          className={`tab-btn flex items-center gap-2 pb-4 px-2 font-bold transition-all ${activeTab === "generated" ? "text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"}`}
          onClick={() => setActiveTab("generated")}
        >
          <FiActivity size={18} />
          Trip Alerts
        </button>
        <button
          className={`tab-btn flex items-center gap-2 pb-4 px-2 font-bold transition-all ${activeTab === "types" ? "text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"}`}
          onClick={() => setActiveTab("types")}
        >
          <FiLayers size={18} />
          Alert Types
        </button>
      </div>

      <div className="card-section">
        {activeTab === "generated" ? (
          <>
            <h3>Recent Trip Alerts</h3>
            <table className="alert-table w-full">
              <thead>
                <tr className="text-left text-gray-500 uppercase text-xs tracking-wider">
                  <th className="p-3">#</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Alert Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">More Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      Loading...
                    </td>
                  </tr>
                ) : alerts.length > 0 ? (
                  (() => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const currentAlerts = alerts.slice(
                      startIndex,
                      startIndex + itemsPerPage,
                    );
                    return (
                      <>
                        {currentAlerts.map((alert, index) => (
                          <tr
                            key={alert.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3 text-gray-600">
                              {startIndex + index + 1}
                            </td>
                            <td className="p-3 font-medium text-gray-800">
                              {alert.user_username || alert.user || "Unknown"}
                            </td>
                            <td className="p-3 text-gray-600">
                              {alert.alert_type}
                            </td>
                            <td className="p-3 text-gray-600">
                              {new Date(alert.timestamp).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <span
                                style={{ whiteSpace: "nowrap" }}
                                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap inline-block ${
                                  alert.severity_display === "Critical Risk" ||
                                  alert.severity === "CRITICAL_RISK" ||
                                  alert.severity === "CRITICAL" ||
                                  alert.severity === "HIGH"
                                    ? "bg-red-100 text-red-700"
                                    : alert.severity_display ===
                                          "Moderate Risk" ||
                                        alert.severity === "MODERATE_RISK" ||
                                        alert.severity === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-700"
                                }`}
                              >
                                {alert.severity_display ||
                                  (alert.severity === "MINOR_RISK"
                                    ? "Minor Risk"
                                    : alert.severity === "MODERATE_RISK"
                                      ? "Moderate Risk"
                                      : alert.severity === "CRITICAL_RISK"
                                        ? "Critical Risk"
                                        : alert.severity)}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  const lat = alert.latitude || 20.5937;
                                  const lng = alert.longitude || 78.9629;
                                  const user =
                                    alert.user_username ||
                                    alert.user ||
                                    "Unknown";
                                  const type = alert.alert_type;
                                  const vehicle =
                                    alert.vehicle_name || "Unknown Vehicle";
                                  const speed = alert.vehicle_speed || 0;
                                  const risk =
                                    alert.severity_display || alert.severity;

                                  navigate(
                                    `map?lat=${lat}&lng=${lng}&type=${type}&user=${user}&vehicle=${encodeURIComponent(vehicle)}&speed=${speed}&risk=${risk}`,
                                  );
                                }}
                                className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110 p-2"
                                title="View Details"
                              >
                                <FaInfoCircle size={24} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })()
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-8 text-gray-500 italic"
                    >
                      No alerts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!loading &&
              alerts.length > 0 &&
              (() => {
                const totalPages = Math.ceil(alerts.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;

                if (totalPages <= 1) return null;

                // Pagination logic: Show [1] ... [curr-1] [curr] [curr+1] ... [last]
                const getPageNumbers = () => {
                  const pages = [];
                  const range = 1; // Number of pages before and after the current page

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) pages.push("...");

                    const start = Math.max(2, currentPage - range);
                    const end = Math.min(totalPages - 1, currentPage + range);

                    for (let i = start; i <= end; i++) pages.push(i);

                    if (currentPage < totalPages - 2) pages.push("...");
                    pages.push(totalPages);
                  }
                  return pages;
                };

                return (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-white/5 px-6 pb-2">
                    <span className="text-sm text-slate-500 mb-4 sm:mb-0">
                      Showing{" "}
                      <span className="font-bold text-white text-gradient">
                        {startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-white text-gradient">
                        {Math.min(startIndex + itemsPerPage, alerts.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-white text-gradient">
                        {alerts.length}
                      </span>{" "}
                      security alerts
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                          currentPage === 1
                            ? "bg-white/5 text-slate-600 cursor-not-allowed opacity-50"
                            : "bg-white/5 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/5 shadow-lg"
                        }`}
                      >
                        <FiChevronLeft size={20} />
                      </button>

                      <div className="flex items-center gap-2">
                        {getPageNumbers().map((page, i) =>
                          page === "..." ? (
                            <span
                              key={`dots-${i}`}
                              className="px-2 text-slate-600 font-bold"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                                currentPage === page
                                  ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110"
                                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                          currentPage === totalPages
                            ? "bg-white/5 text-slate-600 cursor-not-allowed opacity-50"
                            : "bg-white/5 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/5 shadow-lg"
                        }`}
                      >
                        <FiChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                );
              })()}
          </>
        ) : (
          <>
            <h3>Alert Types Configuration</h3>
            <table className="alert-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {alertTypes.length > 0 ? (
                  alertTypes.map((type, index) => (
                    <tr key={type.id}>
                      <td>{index + 1}</td>
                      <td>{type.name}</td>
                      <td>{type.description || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No alert types defined
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
