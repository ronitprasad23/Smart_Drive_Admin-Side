import PublicNavbar from "../components/PublicNavbar";
import { FiInfo, FiCode, FiLayers, FiShield, FiGithub, FiExternalLink } from "react-icons/fi";

export default function About() {
  return (
    <div className="bg-dark-900 min-h-screen overflow-x-hidden font-sans">
      <PublicNavbar />
      
      <div className="pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-fade-in space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
            <div className="w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
          </div>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-8">
            <FiInfo size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            About <span className="text-gradient">Smart Drive Alert</span>
          </h1>
          <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Next-Generation Road Safety Intelligence empowering modern fleets & drivers with preemptive AI diagnostics.
          </p>
        </div>

        {/* Mission Statement Glass Card */}
        <div className="glass-card p-10 md:p-14 border-white/5 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover:bg-emerald-500/10" />
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-4">
              <span className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full inline-block"></span>
              Our Mission
              <span className="w-12 h-1 bg-gradient-to-l from-emerald-500 to-cyan-500 rounded-full inline-block"></span>
            </h3>
            <p className="text-slate-300 text-xl leading-relaxed font-light">
              <strong className="text-white font-semibold">Smart Drive Alert</strong> is an advanced road safety ecosystem engineered to eradicate accidents caused by human error. By fusing <strong className="text-emerald-400 font-semibold">Artificial Intelligence</strong> with real-time sensor data, we analyze micro-behaviors to instantly detect drowsiness, cognitive distraction, and aggressive driving patterns.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              We believe that every life on the road is invaluable. Our goal is to empower drivers with split-second preemptive warnings, while providing fleet managers and administrators with unprecedented analytical oversight to foster a culture of safety.
            </p>
          </div>
        </div>

        {/* Architecture & Tech Stack Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white uppercase tracking-widest text-sm inline-flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Technical Architecture
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="glass-card p-8 border-white/5 hover:-translate-y-2 hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 shadow-lg">
                <FiLayers size={28} />
              </div>
              <h4 className="text-xl text-white font-bold mb-4">Frontend Client</h4>
              <ul className="text-slate-400 text-base space-y-3">
                <li className="flex items-center gap-3"><span className="text-cyan-500 font-bold">•</span> React.js 18+</li>
                <li className="flex items-center gap-3"><span className="text-cyan-500 font-bold">•</span> Vite Build Tool</li>
                <li className="flex items-center gap-3"><span className="text-cyan-500 font-bold">•</span> TailwindCSS Styling</li>
                <li className="flex items-center gap-3"><span className="text-cyan-500 font-bold">•</span> Chart.js Data Viz</li>
              </ul>
            </div>

            <div className="glass-card p-8 border-white/5 hover:-translate-y-2 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 border border-emerald-500/20 shadow-lg">
                <FiCode size={28} />
              </div>
              <h4 className="text-xl text-white font-bold mb-4">Backend Core</h4>
              <ul className="text-slate-400 text-base space-y-3">
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">•</span> Django REST Framework</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">•</span> Python 3.10+</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">•</span> PostgreSQL Database</li>
                <li className="flex items-center gap-3"><span className="text-emerald-500 font-bold">•</span> JWT Authentication</li>
              </ul>
            </div>

            <div className="glass-card p-8 border-white/5 hover:-translate-y-2 hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full pointer-events-none" />
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 border border-purple-500/20 shadow-lg">
                <FiShield size={28} />
              </div>
              <h4 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
                AI Engine 
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
              </h4>
              <ul className="text-slate-400 text-base space-y-3">
                <li className="flex items-center gap-3"><span className="text-purple-500 font-bold">•</span> TensorFlow / Keras</li>
                <li className="flex items-center gap-3"><span className="text-purple-500 font-bold">•</span> OpenCV Vision</li>
                <li className="flex items-center gap-3"><span className="text-purple-500 font-bold">•</span> Scikit-Learn</li>
                <li className="flex items-center gap-3"><span className="text-purple-500 font-bold">•</span> Edge Compute Ready</li>
              </ul>
            </div>

          </div>
        </div>

        {/* System Information Meta */}
        <div className="glass-card p-10 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent mt-20">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-white uppercase tracking-widest text-sm inline-flex items-center gap-3">
              System Specifications
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-white/10">
            <div className="text-center px-4">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-3">Build Version</p>
              <p className="text-white font-mono text-2xl font-bold">1.0.0-rc2</p>
            </div>
            
            <div className="text-center px-4 border-l border-white/10 md:border-l-0">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-3">Last Updated</p>
              <p className="text-white text-lg font-medium">April 2026</p>
            </div>
            
            <div className="text-center px-4 mt-6 md:mt-0">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-3">License Type</p>
              <p className="text-white text-lg font-medium">Enterprise Proprietary</p>
            </div>
            
            <div className="text-center px-4 mt-6 md:mt-0 border-l border-white/10 md:border-l-0">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-3">Environment</p>
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider w-full max-w-[180px] mx-auto">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Production
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 pt-10 border-t border-white/5">
          <button className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 hover:border-white/20 font-semibold w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1">
            <FiGithub size={20} /> Project Repository
          </button>
          <button className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-400 hover:text-cyan-300 transition-all border border-cyan-500/20 hover:border-cyan-500/40 font-semibold w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1">
            <FiExternalLink size={20} /> API Documentation
          </button>
        </div>

      </div>

      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-500 text-sm bg-dark-900/50 mt-20">
        <p>&copy; 2026 Smart Drive Alert. All rights reserved. Advanced AI for Safer Roads.</p>
      </footer>
    </div>
  );
}
