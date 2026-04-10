import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gradient tracking-tight">
          Smart Drive Alert
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Home</Link>
          <Link to="/about" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">About</Link>
          <Link 
            to="/login" 
            className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-lg font-semibold hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}