import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";
import { FiSettings, FiBell, FiShield, FiMail, FiMessageSquare, FiSmartphone, FiChevronRight } from "react-icons/fi";

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const [appName, setAppName] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/system-settings/');
      const data = response.data;

      const settingsMap = {};
      data.forEach(item => {
        settingsMap[item.key] = item;
      });

      setSettings(settingsMap);

      if (settingsMap['app_name']) setAppName(settingsMap['app_name'].value);
      if (settingsMap['email_alerts']) setEmailAlerts(settingsMap['email_alerts'].value === 'true');
      if (settingsMap['sms_alerts']) setSmsAlerts(settingsMap['sms_alerts'].value === 'true');

    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      const setting = settings[key];
      if (setting) {
        await api.patch(`/admin/system-settings/${setting.id}/`, { value: String(value) });
      } else {
        await api.post('/admin/system-settings/', { key, value: String(value) });
      }

      fetchSettings();
    } catch (error) {
      console.error("Failed to save setting", error);
    }
  };

  const handleToggleEmail = () => {
    const newValue = !emailAlerts;
    setEmailAlerts(newValue);
    saveSetting('email_alerts', newValue);
  };

  const handleToggleSms = () => {
    const newValue = !smsAlerts;
    setSmsAlerts(newValue);
    saveSetting('sms_alerts', newValue);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-6xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <FiSettings size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Settings</h2>
          <p className="text-slate-500 text-sm font-medium">Configure global application behavior and notifications</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Application Settings */}
        <div className="glass-card p-8 border-white/5 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <FiSettings className="text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Application</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">App Name</label>
              <div className="relative group">
                <input
                  type="text"
                  value={appName}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-slate-500 focus:outline-none opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Admin Email</label>
              <div className="relative group">
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder-slate-500 focus:outline-none opacity-60 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card p-8 border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <FiBell className="text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-[1.01] group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <FiMail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Alerts</h4>
                  <p className="text-xs text-slate-500">Critical events via email</p>
                </div>
              </div>

              <button
                onClick={handleToggleEmail}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 focus:outline-none ring-offset-dark-900 ring-emerald-500/20 ${emailAlerts ? 'bg-emerald-500 ring-4' : 'bg-slate-700'}`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-500 ease-in-out ${emailAlerts ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* SMS Alerts Toggle */}
            <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all hover:scale-[1.01] group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                  <FiMessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white">SMS Alerts</h4>
                  <p className="text-xs text-slate-500">Real-time mobile updates</p>
                </div>
              </div>

              <button
                onClick={handleToggleSms}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 focus:outline-none ring-offset-dark-900 ring-cyan-500/20 ${smsAlerts ? 'bg-cyan-500 ring-4' : 'bg-slate-700'}`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-500 ease-in-out ${smsAlerts ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-5 bg-dark-950/40 border border-white/5 rounded-2xl opacity-60 grayscale cursor-not-allowed">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 text-slate-500 rounded-xl">
                  <FiSmartphone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 flex items-center gap-2">
                    Push Alerts
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-white/5">Upcoming</span>
                  </h4>
                  <p className="text-xs text-slate-600">Browser push messages</p>
                </div>
              </div>

              <div className="w-14 h-7 bg-slate-800 rounded-full p-1 flex items-center">
                <div className="bg-slate-900 w-5 h-5 rounded-full shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="glass-card p-8 border-white/5 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
                <FiShield size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Security & Access</h3>
                <p className="text-slate-500 text-sm">Manage your credentials and account safety</p>
              </div>
            </div>

            <Link to="/dashboard/change-password" title="Go to Change Password">
              <button className="btn-primary w-full md:w-auto bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/20 flex items-center justify-center gap-2 group">
                Change Password <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};