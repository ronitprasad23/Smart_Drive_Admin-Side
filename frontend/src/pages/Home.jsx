import PublicNavbar from "../components/PublicNavbar";
import { FiAlertCircle, FiCpu, FiLayout, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-dark-900 overflow-x-hidden">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_bg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover animate-subtle-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/80 to-dark-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full">
            Next-Gen Road Safety
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
            AI Powered <span className="text-gradient">Smart Drive Alert</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Empowering drivers with real-time machine learning diagnostics to detect drowsiness, distraction, and unsafe behaviors before they lead to accidents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login" className="btn-primary flex items-center gap-2 group">
              Get Started <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn-outline">
              Explore Tech
            </a>
          </div>
        </div>

        {/* Floating gradient element */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 relative z-10 border-t border-white/5 bg-dark-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-10 group hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                <FiAlertCircle size={32} className="text-emerald-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Alerts</h3>
              <p className="text-gray-400 leading-relaxed">
                Instant audible and visual warnings for overspeeding, drowsiness, and lane departure using advanced sensor fusion.
              </p>
            </div>

            <div className="glass-card p-10 group hover:border-cyan-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-500">
                <FiCpu size={32} className="text-cyan-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Detection</h3>
              <p className="text-gray-400 leading-relaxed">
                Proprietary machine learning models continuously analyze facial markers and driving patterns on-device for total privacy.
              </p>
            </div>

            <div className="glass-card p-10 group hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                <FiLayout size={32} className="text-emerald-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Central Dashboard</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprehensive oversight for fleet managers or individuals to monitor safety trends, alert history, and risk levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 bg-dark-800/30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Revolutionizing <br/><span className="text-gradient">Driver Safety</span></h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-6 italic">
              "Smart Drive Alert is more than just a tool; it's a co-pilot designed to preserve life through intelligence."
            </p>
            <p className="text-gray-400 leading-relaxed">
              Built using a state-of-the-art stack including React, Django, and deep learning architectures, our goal is to eliminate human error behind the wheel by providing an extra set of digital eyes that never get tired.
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="glass-card p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="/Driver_logo.png" 
                alt="Project Vision" 
                className="rounded-xl w-full h-auto opacity-80"
              />
            </div>
            <div className="absolute -z-10 inset-0 bg-emerald-500/20 blur-[80px] rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Smart Drive Alert. All rights reserved. Advanced AI for Safer Roads.</p>
      </footer>
    </div>
  );
}

export default Home;