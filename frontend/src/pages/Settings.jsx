import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";

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

  if (loading) return <div>Loading settings...</div>;

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings ⚙️</h2>

      <div className="settings-wrapper">

        {/* Application Settings */}
        <div className="settings-card">
          <h3>Application Settings</h3>

          <label>App Name</label>
          <input
            type="text"
            value={appName}
            readOnly
            className="bg-gray-100 cursor-not-allowed"
          />

          <label>Admin Email</label>
          <input type="email" defaultValue={user?.email || ""} readOnly className="bg-gray-100 cursor-not-allowed" />
        </div>

        {/* Notification Settings */}
        <div className="settings-card">
          <h3>Notification Settings</h3>
          <div className="space-y-4 mt-4">

            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Email Alerts</h4>
                  <p className="text-xs text-gray-500">Get notified via email for critical events</p>
                </div>
              </div>

              <button
                onClick={handleToggleEmail}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${emailAlerts ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* SMS Alerts Toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    SMS Alerts
                  </h4>
                  <p className="text-xs text-gray-500">Receive text messages on your phone</p>
                </div>
              </div>

              <button
                onClick={handleToggleSms}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${smsAlerts ? 'bg-green-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${smsAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Push Notifications Toggle */}
            <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50 opacity-75 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 text-gray-500 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 flex items-center gap-2">
                    Push Notifications
                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">Soon</span>
                  </h4>
                  <p className="text-xs text-gray-400">Browser and mobile push alerts</p>
                </div>
              </div>

              <div className="w-12 h-6 bg-gray-200 rounded-full p-1 flex items-center">
                <div className="bg-white w-4 h-4 rounded-full shadow-sm" />
              </div>
            </div>

          </div>
        </div>

        {/* Security */}
        <div className="settings-card">
          <h3>Security</h3>
          <p>To change your password, verify your identity on the dedicated page.</p>
          <Link to="/dashboard/change-password">
            <button className="save-btn danger" style={{ marginTop: '1rem' }}>Go to Change Password</button>
          </Link>
        </div>

      </div>
    </>
  );
}