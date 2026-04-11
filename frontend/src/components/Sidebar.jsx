import { NavLink } from "react-router-dom";
import { FiCpu, FiChevronRight, FiGrid, FiAlertCircle, FiNavigation, FiUsers, FiTruck, FiMapPin, FiLayers, FiSettings, FiUser, FiBarChart2 } from "react-icons/fi";

export default function Sidebar() {
  const navItems = [
    {
      name: "Dashboard", path: "/dashboard", end: true, icon: <FiGrid size={20} />
    },
    {
      name: "Alerts", path: "/dashboard/alerts", icon: <FiAlertCircle size={20} />
    },
    {
      name: "Trips", path: "/dashboard/trips", icon: <FiNavigation size={20} />
    },
    {
      name: "Users", path: "/dashboard/users", icon: <FiUsers size={20} />
    },
    {
      name: "Vehicles", path: "/dashboard/vehicles", icon: <FiTruck size={20} />
    },
    {
      name: "Accident Zones", path: "/dashboard/AccidentZones", icon: <FiMapPin size={20} />
    },
    {
      name: "Features", path: "/dashboard/features", icon: <FiLayers size={20} />
    },
    {
      name: "Reports", path: "/dashboard/reports", icon: <FiBarChart2 size={20} />
    },
    {
      name: "Settings", path: "/dashboard/settings", icon: <FiSettings size={20} />
    },
  ];

  return (
    <aside className="w-72 bg-dark-900 text-slate-300 min-h-screen flex flex-col border-r border-white/5 shadow-2xl z-20">
      {/* Brand Section */}
      <div className="h-24 flex items-center px-8 border-b border-white/5 bg-dark-950/50 backdrop-blur-md">
        <h2 className="text-2xl font-black text-gradient tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
             <FiCpu className="text-white" />
          </div>
          Smart Drive
        </h2>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-10 px-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4 opacity-50">
          Main Menu
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                : "hover:bg-white/5 hover:text-white border border-transparent"
              }`
            }
          >
            <span className="relative z-10 transition-transform group-hover:scale-110">
              {item.icon}
            </span>

            <span className="relative z-10 font-semibold tracking-wide text-sm">
              {item.name}
            </span>
            
            <FiChevronRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-6 border-t border-white/5 bg-dark-950/20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">
            <FiUser />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Administrator</p>
            <p className="text-[10px] text-slate-500 truncate">System Controller</p>
          </div>
        </div>
      </div>
    </aside>
  );
}