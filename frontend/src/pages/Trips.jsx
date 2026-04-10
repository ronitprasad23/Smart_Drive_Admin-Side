import { useEffect, useState } from "react";
import api from "../services/api";

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        user: "",
        vehicle: "",
        start_time: "",
        end_time: "",
        start_location: "",
        end_location: "",
        distance_km: 0,
        status: "ONGOING"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tripsRes, usersRes, vehiclesRes] = await Promise.all([
                api.get('/admin/trips/'),
                api.get('/admin/users/'),
                api.get('/admin/vehicles/')
            ]);
            setTrips(tripsRes.data);
            setUsers(usersRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setFormData({
            ...formData,
            user: userId,
            vehicle: "" // Reset vehicle when user changes
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalError("");
        try {
            await api.post('/admin/trips/', formData);
            setIsModalOpen(false);
            fetchData(); // Refresh list
            // Reset form
            setFormData({
                user: "",
                vehicle: "",
                start_time: "",
                end_time: "",
                start_location: "",
                end_location: "",
                distance_km: 0,
                status: "ONGOING"
            });
        } catch (error) {
            console.error("Failed to create trip", error);
            setModalError(error.response?.data?.detail || "Failed to create trip. Please check your inputs.");
        }
    };

    // Filter vehicles based on selected user
    const availableVehicles = formData.user
        ? vehicles.filter(v => String(v.user) === String(formData.user))
        : [];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white-800">Trip Management 🚗</h2>
            </div>

            <div className="card-section">
                <h3>All Trips</h3>
                <table className="alert-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Start Time</th>
                            <th>Distance (km)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                        ) : trips.length > 0 ? (
                            trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td>{trip.id}</td>
                                    <td>{trip.user_details || trip.username || trip.user || 'Unknown'}</td>
                                    <td>
                                        <span style={{
                                            color: trip.status === 'COMPLETED' ? '#16a34a' :
                                                trip.status === 'ONGOING' ? '#2563eb' :
                                                    trip.status === 'SCHEDULED' ? '#0891b2' : '#dc2626',
                                            fontWeight: 'bold'
                                        }}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td>{new Date(trip.start_time).toLocaleString()}</td>
                                    <td>{trip.distance_km}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: "center" }}>No trips found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}