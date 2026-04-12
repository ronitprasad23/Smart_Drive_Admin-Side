import { FiActivity, FiCpu, FiMapPin, FiLayout, FiSmartphone, FiBarChart2, FiNavigation, FiAlertTriangle, FiZap, FiCode } from "react-icons/fi";

export default function Features() {
  const currentFeatures = [
    {
      title: "Real-Time Driving Alerts",
      description: "Advanced system that detects overspeeding, harsh braking, and unsafe driving patterns using real-time sensor and trip data.",
      icon: <FiActivity size={24} />,
      gradient: "from-emerald-500 to-teal-500",
      type: "Safety"
    },
    {
      title: "AI Risk Analysis",
      description: "Sophisticated Machine Learning models analyze driving behavior in real-time to calculate precise risk scores for every trip.",
      icon: <FiCpu size={24} />,
      gradient: "from-blue-500 to-indigo-500",
      type: "Intelligence"
    },
    {
      title: "Accident Zone ID",
      description: "Identification of high-risk accident zones using deep historical data analysis and predictive geodata mapping.",
      icon: <FiMapPin size={24} />,
      gradient: "from-orange-500 to-red-500",
      type: "Geodata"
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive control suite to monitor users, alerts, accident zones, and system configurations from a single cockpit.",
      icon: <FiLayout size={24} />,
      gradient: "from-purple-500 to-pink-500",
      type: "Control"
    }
  ];

  const upcomingFeatures = [
    {
      title: "Mobile Integration",
      description: "Dedicated Android & iOS applications for drivers to receive instant safety alerts and detailed trip summaries.",
      icon: <FiSmartphone size={24} />,
      status: "In Development"
    },
    {
      title: "Advanced Analytics",
      description: "Interactive graphs, heatmaps, and deep-dive reports for accident trends and complex driver behavior analysis.",
      icon: <FiBarChart2 size={24} />,
      status: "Prototyping"
    },
    {
      title: "Live Vehicle Tracking",
      description: "Real-time precision GPS tracking for fleet management and accelerated emergency response systems.",
      icon: <FiNavigation size={24} />,
      status: "Planned"
    },
    {
      title: "Emergency SOS",
      description: "Autonomous emergency alert system that notifies emergency contacts and authorities instantly upon severe impact detection.",
      icon: <FiAlertTriangle size={24} />,
      status: "Strategic"
    }
  ];

  return (
    <div className="animate-fade-in space-y-12 pb-10">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <FiZap size={24} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Application Features</h2>
          <p className="text-slate-500 text-sm font-medium">Explore the core capabilities of the Smart Drive ecosystem</p>
        </div>
      </div>

      {/* Currently Available Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest text-sm">System Capabilities</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {currentFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card group p-8 border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden"
            >
              {/* Decorative Gradient Background */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-3xl transition-all duration-700`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                  {feature.icon}
                </div>
                
                <div className="mt-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80 mb-2 block">{feature.type}</span>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{feature.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <h3 className="text-lg font-bold text-slate-300 uppercase tracking-widest text-sm">Future Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-6 border-white/5 hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
            >
              {/* Beta Badge */}
              <div className="absolute top-4 right-4 text-[9px] font-black bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-tighter">
                {feature.status}
              </div>

              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-5 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 border border-cyan-500/20">
                {feature.icon}
              </div>
              
              <h5 className="font-bold text-white mb-2 text-sm">{feature.title}</h5>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}