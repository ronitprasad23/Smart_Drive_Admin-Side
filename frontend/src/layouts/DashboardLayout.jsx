import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import "../dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-dark-900 min-h-screen text-slate-300">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardNavbar />
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}