import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function AlertMap() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const DEFAULT_LAT = 20.5937;
    const DEFAULT_LNG = 78.9629;

    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const hasParams = latParam && lngParam && latParam !== "null" && latParam !== "undefined" && latParam !== "0" && lngParam !== "0";

    const lat = hasParams ? parseFloat(latParam) : DEFAULT_LAT;
    const lng = hasParams ? parseFloat(lngParam) : DEFAULT_LNG;

    const zoomLevel = hasParams ? 13 : 5;

    const alertType = searchParams.get('type') || 'Accident Alert';
    const user = searchParams.get('user') || 'Unknown User';
    const vehicle = searchParams.get('vehicle') || 'Unknown Vehicle';
    const speed = searchParams.get('speed') || '0';
    const risk = searchParams.get('risk') || 'Unknown';

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-white-800 flex items-center gap-2">
                    <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-gray-600 transition-colors">
                        ←
                    </span>
                    Alert Location Map 🗺️
                </h2>
            </div>

            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
                {/* Details Card */}
                <div className="lg:w-1/3 bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4 overflow-y-auto h-full">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 sticky top-0 bg-white z-10 shrink-0">Incident Details</h3>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-sm block mb-1">User Name</span>
                            <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                                👤 {user}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-sm block mb-1">Alert Type</span>
                            <span className="text-gray-900 font-medium flex items-center gap-2">
                                🚨 {alertType}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-sm block mb-1">Risk Level</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${risk.includes('Critical') || risk.includes('High') ? 'bg-red-100 text-red-700' :
                                risk.includes('Moderate') || risk.includes('Medium') ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {risk}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-sm block mb-1">Vehicle Name</span>
                            <span className="text-gray-900 font-medium flex items-center gap-2">
                                🚗 {decodeURIComponent(vehicle)}
                            </span>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-sm block mb-1">Vehicle Speed</span>
                            <span className="text-gray-900 font-bold text-xl flex items-center gap-2">
                                ⚡ {parseFloat(speed).toFixed(1)} km/h
                            </span>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="lg:w-2/3 h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
                    <MapContainer
                        center={[lat, lng]}
                        zoom={zoomLevel}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                        key={`${lat}-${lng}-${zoomLevel}`}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {hasParams && (
                            <Marker position={[lat, lng]}>
                                <Popup>
                                    <div className="text-center">
                                        <strong className="text-gray-800 text-lg block mb-1">{alertType}</strong>
                                        <span className="text-gray-600 block mb-1">{user}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${risk.includes('Critical') ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                            }`}>{risk}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}