import { useState, useEffect } from "react";
import api from "../services/api";

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [formData, setFormData] = useState({
        user: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        license_plate: "",
        vin: ""
    });
    const [modalError, setModalError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [vehiclesRes, usersRes] = await Promise.all([
                api.get("/admin/vehicles/"),
                api.get("/admin/users/")
            ]);
            setVehicles(vehiclesRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load vehicle data.");
        } finally {
            setLoading(false);
        }
    };

    const filteredVehicles = vehicles.filter(vehicle => {
        const query = searchQuery.toLowerCase();
        const userName = vehicle.user_details ? vehicle.user_details.toLowerCase() : String(vehicle.user).toLowerCase();

        return (
            userName.includes(query) ||
            vehicle.make.toLowerCase().includes(query) ||
            vehicle.model.toLowerCase().includes(query) ||
            vehicle.license_plate.toLowerCase().includes(query) ||
            (vehicle.vin && vehicle.vin.toLowerCase().includes(query))
        );
    });

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const openEditModal = (vehicle) => {
        setCurrentVehicle(vehicle);

        setFormData({
            user: vehicle.user,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
            vin: vehicle.vin || ""
        });
        setModalError("");
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            await api.delete(`/admin/vehicles/${id}/`);
            fetchData();
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Failed to delete vehicle.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setModalError("");
        try {
            if (currentVehicle) {
                await api.patch(`/admin/vehicles/${currentVehicle.id}/`, formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Save failed", err);
            setModalError(err.response?.data?.detail || "Operation failed.");
        }
    };

    if (loading) return <div>Loading vehicles...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Vehicles Management 🚗</h2>
            </div>

            {}
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Search by owner, make, model, or license plate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-4 pl-12 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-gray-700"
                />
                <svg
                    className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <div className="card-section">
                <table className="alert-table w-full">
                    <thead>
                        <tr className="text-left text-gray-500 uppercase text-xs tracking-wider">
                            <th className="p-3">User</th>
                            <th className="p-3">Make</th>
                            <th className="p-3">Model</th>
                            <th className="p-3">Year</th>
                            <th className="p-3">License Plate</th>
                            <th className="p-3">VIN</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentVehicles.length > 0 ? (
                            currentVehicles.map((vehicle) => (
                                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-gray-800">
                                        {vehicle.user_details || vehicle.user}
                                    </td>
                                    <td className="p-3 text-gray-600">{vehicle.make}</td>
                                    <td className="p-3 text-gray-600">{vehicle.model}</td>
                                    <td className="p-3 text-gray-600">{vehicle.year}</td>
                                    <td className="p-3">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 text-sm font-mono">
                                            {vehicle.license_plate}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500 text-sm">{vehicle.vin || "-"}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditModal(vehicle)}
                                                title="Edit Vehicle"
                                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
                                                title="Delete Vehicle"
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-8 text-gray-500 italic">
                                    No vehicles found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {}
                {!loading && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 px-4 pb-4">
                        <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                            Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, filteredVehicles.length)}</span> of <span className="font-medium text-gray-900">{filteredVehicles.length}</span> vehicles
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentPage === page
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Edit Vehicle</h3>

                        {modalError && (
                            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Owner</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.user}
                                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select User</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.username} ({u.email || 'No Email'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3 flex gap-2">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-1">Make</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={formData.make}
                                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-1">Model</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Year</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">License Plate</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={formData.license_plate}
                                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">VIN (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={formData.vin}
                                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}