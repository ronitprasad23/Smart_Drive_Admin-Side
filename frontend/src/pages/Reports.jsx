import React, { useState, useEffect } from 'react';
import { 
    FiCalendar, FiUsers, FiTruck, FiSearch, FiDownload, 
    FiAlertCircle, FiTrendingUp, FiTrendingDown, FiMapPin, FiMoreHorizontal, FiBell 
} from 'react-icons/fi';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to center map
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const KPICard = ({ title, value, trend, positive, icon: Icon }) => (
    <div className="stat-card group relative overflow-hidden">
        {/* Decorative Glow */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${positive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{title}</h4>
            <div className={`p-2.5 rounded-xl ${positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border border-white/5`}>
                <Icon size={18} />
            </div>
        </div>

        <div className="relative z-10">
            <div className="text-4xl font-black text-white mb-2 tracking-tight">
                <span className={positive ? 'text-gradient' : 'text-red-400'}>{value}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className={`flex items-center gap-1 ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {positive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                    {trend}
                </span>
                <span className="text-slate-600">last 30 days</span>
            </div>
        </div>
    </div>
);

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    
    // Filters State
    const [filters, setFilters] = useState({
        driver: 'all',
        vehicle: 'all'
    });

    const [data, setData] = useState({
        kpis: { total_alerts: 0, total_trips: 0, active_drivers: 0, critical_alerts: 0 },
        alerts_by_type: [],
        severity_data: [],
        trends: [],
        recent_events: [],
        map_points: [],
        metadata: { drivers: [], vehicles: [] }
    });

    const [error, setError] = useState(null);

    const fetchReports = async (isInitial = false) => {
        if (!isInitial) setRefetching(true);
        setError(null);
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/analytics/reports/?${params.toString()}`);
            
            if (response.data.error) {
                setError(response.data.error);
                setRefetching(false);
                return;
            }
            
            setData(response.data);
            if (isInitial) setLoading(false);
            setRefetching(false);
        } catch (error) {
            setError("Failed to connect to analytics service.");
            if (isInitial) setLoading(false);
            setRefetching(false);
        }
    };

    useEffect(() => {
        fetchReports(true);
    }, []);

    // Refetch when filters change (except initial load which is handled above)
    // We add a slight delay or check to ensure we don't fetch with stale values
    useEffect(() => {
        if (!loading) {
            fetchReports();
        }
    }, [filters.driver, filters.vehicle]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'driver') {
            setFilters({ driver: value, vehicle: 'all' });
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGeneratePDF = async () => {
        setGeneratingPDF(true);
        setError(null);
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/analytics/reports/pdf/?${params.toString()}`, {
                responseType: 'blob'
            });
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Generate filename based on filters
            let filename = 'Fleet_Overview_Report.pdf';
            if (filters.driver !== 'all') {
                const driverName = data.metadata.drivers.find(d => String(d.id) === String(filters.driver))?.username || 'User';
                filename = `${driverName}_Safety_Report.pdf`;
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setGeneratingPDF(false);
        } catch (error) {
            console.error("PDF Error:", error);
            setError("Failed to generate and download the PDF report.");
            setGeneratingPDF(false);
        }
    };

    const severityColors = {
        'High': '#ef4444',
        'Medium': '#f59e0b',
        'Low': '#10b981'
    };

    const months = [
        { val: 'all', label: 'All Time' },
        { val: '1', label: 'January' }, { val: '2', label: 'February' },
        { val: '3', label: 'March' }, { val: '4', label: 'April' },
        { val: '5', label: 'May' }, { val: '6', label: 'June' },
        { val: '7', label: 'July' }, { val: '8', label: 'August' },
        { val: '9', label: 'September' }, { val: '10', label: 'October' },
        { val: '11', label: 'November' }, { val: '12', label: 'December' }
    ];

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                <div className="text-lg font-bold text-slate-500 animate-pulse uppercase tracking-[0.2em]">Initializing Analytics...</div>
            </div>
        );
    }

    return (
        <div className={`transition-opacity duration-300 ${refetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            {/* Header section - CLEAN & REFINED */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-1">Reports Dashboard</h1>
                    <p className="text-slate-500 font-bold italic text-sm">Real-time safety metrics & fleet intelligence</p>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="my-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 font-bold animate-shake">
                    <FiAlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Filter Bar & Action */}
            <div className="flex flex-wrap items-center gap-4 my-8">
                {/* Selectors */}
                <div className="flex-1 flex gap-4 min-w-[300px]">
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3 focus-within:border-emerald-500/50 transition-all">
                        <FiUsers className="text-slate-500" />
                        <select 
                            name="driver"
                            value={filters.driver}
                            onChange={handleFilterChange}
                            className="bg-transparent border-none text-sm font-bold text-white focus:outline-none w-full appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-dark-900">All Analytics Users</option>
                            {data.metadata.drivers.map(d => (
                                <option key={d.id} value={d.id} className="bg-dark-900">{d.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center gap-3 focus-within:border-emerald-500/50 transition-all">
                        <FiTruck className="text-slate-500" />
                        <select 
                            name="vehicle"
                            value={filters.vehicle}
                            onChange={handleFilterChange}
                            className="bg-transparent border-none text-sm font-bold text-white focus:outline-none w-full appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-dark-900">All Active Vehicles</option>
                            {data.metadata.vehicles.map(v => (
                                <option key={v.id} value={v.id} className="bg-dark-900">{v.model} ({v.plate_number})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    onClick={handleGeneratePDF}
                    disabled={generatingPDF}
                    className="save-btn min-w-[200px] flex items-center justify-center gap-2 group border-none"
                >
                    {generatingPDF ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <FiDownload size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    )}
                    <span className="text-white">{generatingPDF ? 'Preparing PDF...' : 'Download PDF Report'}</span>
                </button>
            </div>

            {/* KPI Grid */}
            <div className="stats-grid mb-10">
                <KPICard title="Total Alerts" value={data.kpis.total_alerts} trend="+12.4%" positive={true} icon={FiAlertCircle} />
                <KPICard title="Total Trips" value={data.kpis.total_trips} trend="+5.3%" positive={true} icon={FiAlertCircle} />
                <KPICard title="Active Drivers" value={data.kpis.active_drivers} trend="+2.2%" positive={true} icon={FiUsers} />
                <KPICard title="Critical Alerts" value={data.kpis.critical_alerts} trend="-14.8%" positive={false} icon={FiAlertCircle} />
            </div>

            {/* Row 1: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Bar Chart: Alerts Type */}
                <div className="lg:col-span-2 card-section mb-0">
                    <h3 className="flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                        Safety Event Distribution
                    </h3>
                    <div className="h-[350px] mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.alerts_by_type}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                                    contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'}} 
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {data.alerts_by_type.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#06b6d4'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Severity */}
                <div className="card-section mb-0">
                    <h3 className="mb-8">Alert Severity</h3>
                    <div className="h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.severity_data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={10}
                                    dataKey="value"
                                >
                                    {data.severity_data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={severityColors[entry.name] || '#ccc'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-white">
                                {data.kpis.total_alerts > 0 
                                    ? Math.round((data.severity_data.reduce((acc, curr) => acc + curr.value, 0) / data.kpis.total_alerts * 100)) 
                                    : 0}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Efficiency</span>
                        </div>
                    </div>
                    <div className="mt-10 space-y-3">
                        {data.severity_data.map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: severityColors[item.name] || '#ccc'}}></div>
                                    <span className="text-xs font-bold text-slate-400 capitalize">{item.name} Risk</span>
                                </div>
                                <span className="text-sm font-black text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 2: Trend & Recent Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Line Chart: Trends */}
                <div className="lg:col-span-2 card-section">
                    <h3 className="flex items-center justify-between">
                        <span>Fleet Activity Trends</span>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-blue-400">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div> Trips
                            </div>
                            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Alerts
                            </div>
                        </div>
                    </h3>
                    <div className="h-[350px] mt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}} />
                                <Line type="monotone" dataKey="trips" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a'}} animationDuration={1000} />
                                <Line type="monotone" dataKey="alerts" stroke="#10b981" strokeWidth={4} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a'}} animationDuration={1000} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Table & Map */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="card-section p-0 flex-1 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="mb-0 text-white">Recent Activity</h3>
                            <button className="text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">Live Feed</button>
                        </div>
                        <div className="overflow-y-auto max-h-[350px]">
                            <table className="alert-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Event</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recent_events.length > 0 ? data.recent_events.map((event) => (
                                        <tr key={event.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-black border border-emerald-500/10">
                                                        {event.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{event.name}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{event.time}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`text-[9px] font-black px-2.5 py-1 rounded-lg inline-block uppercase tracking-widest border ${
                                                    event.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                                    event.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                }`}>
                                                    {event.type}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" className="text-center py-12 text-slate-500 italic text-sm font-bold opacity-30">No matching events</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RE-DESIGNED MAP SECTION */}
                    <div className="h-[380px] rounded-[2rem] overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative group">
                        {/* Interactive Overlay Effects */}
                        <div className="map-scanner"></div>
                        <div className="absolute inset-0 border-[10px] border-emerald-500/5 pointer-events-none z-[999] rounded-[2rem]"></div>
                        
                        <MapContainer 
                            center={data.map_points.length > 0 ? [data.map_points[0].lat, data.map_points[0].lng] : [23.0225, 72.5714]} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={true}
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                            {data.map_points.length > 0 && <ChangeView center={[data.map_points[0].lat, data.map_points[0].lng]} zoom={13} />}
                            
                            {data.map_points.slice(0, 20).map((point, idx) => (
                                <Marker 
                                    key={idx} 
                                    position={[point.lat, point.lng]}
                                    icon={new L.DivIcon({
                                        className: 'custom-div-icon',
                                        html: `
                                            <div class="relative w-full h-full flex items-center justify-center">
                                                <div class="map-marker-ping" style="background-color: ${point.severity === 'High' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.6)'}"></div>
                                                <div style="background-color: ${point.severity === 'High' ? '#ef4444' : '#10b981'}; width: 14px; height: 14px; border: 3px solid rgba(255,255,255,0.4); border-radius: 50%; box-shadow: 0 0 15px currentColor; position: relative; z-index: 10;"></div>
                                            </div>
                                        `,
                                        iconSize: [14, 14],
                                        iconAnchor: [7, 7]
                                    })}
                                >
                                    <Popup className="custom-popup dark-popup">
                                        <div className="p-2 bg-dark-950 text-white rounded-xl border border-white/10 shadow-2xl">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${point.severity === 'High' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{point.severity} Alert</span>
                                            </div>
                                            <div className="text-xs font-bold mb-1">{point.type}</div>
                                            <div className="text-[9px] text-slate-400 font-medium">{point.location}</div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        
                        <div className="absolute top-5 left-14 z-[1000] flex flex-col gap-2">
                             <div className="bg-dark-900/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 animate-fade-in group-hover:border-emerald-500/30 transition-all">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Intelligence Feed</span>
                                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Status: Active Scanning</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorator Corner */}
                        <div className="absolute bottom-4 right-4 z-[1000] opacity-20 pointer-events-none">
                            <div className="text-[40px] font-black text-emerald-500/20 italic tracking-tighter">SD-AI</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
