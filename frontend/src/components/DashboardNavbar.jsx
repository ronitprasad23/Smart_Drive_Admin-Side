import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiUser, FiLock, FiChevronDown, FiBell } from "react-icons/fi";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-navbar glass-nav sticky top-0 z-40 flex items-center justify-between px-8 py-4 backdrop-blur-xl border-b border-white/5 bg-dark-900/60">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          Welcome, <span className="text-gradient">{user?.first_name || user?.username || 'Admin'}</span> 👋
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-emerald-400 transition-colors">
          <FiBell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-dark-900"></span>
        </button>

        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group p-1.5 pl-3 rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setOpen(!open)}
          >
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {user?.username || 'Admin'}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                {user?.is_staff ? 'System Admin' : 'User'}
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            
            <FiChevronDown className={`text-slate-500 group-hover:text-white transition-all duration-300 ${open ? 'rotate-180' : ''}`} />
          </div>

          {open && (
            <div className="absolute top-full right-0 mt-3 w-64 glass-card border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden animate-fade-in z-50">
              <div className="p-5 border-b border-white/5 bg-white/5">
                <p className="text-sm font-bold text-white">{user?.username || 'Admin'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@gmail.com'}</p>
              </div>

              <div className="p-2">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all group"
                  onClick={() => { navigate("/dashboard/profile"); setOpen(false); }}
                >
                  <FiUser className="text-slate-500 group-hover:text-emerald-400" />
                  My Profile
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-emerald-500/10 rounded-lg transition-all group"
                  onClick={() => { navigate("/dashboard/change-password"); setOpen(false); }}
                >
                  <FiLock className="text-slate-500 group-hover:text-emerald-400" />
                  Change Password
                </button>
              </div>

              <div className="p-2 border-t border-white/5">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all group"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-red-500/50 group-hover:text-red-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}