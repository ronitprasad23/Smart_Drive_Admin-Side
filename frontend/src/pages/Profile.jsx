import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user } = useAuth();

    return (
        <>
            <h2>My Profile 👤</h2>

            <div className="settings-wrapper">
                <div className="settings-card">
                    <h3>Personal Information</h3>

                    <div className="profile-details">
                        <div className="detail-group">
                            <label>Username</label>
                            <p className="detail-value">{user?.username || "N/A"}</p>
                        </div>

                        <div className="detail-group">
                            <label>Email</label>
                            <p className="detail-value">{user?.email || "N/A"}</p>
                        </div>

                        <div className="detail-group">
                            <label>Role</label>
                            <span className={`status-badge ${user?.is_staff ? "safe" : "warning"}`}>
                                {user?.is_staff ? "Administrator" : "User"}
                            </span>
                        </div>

                        <div className="detail-group">
                            <label>Date Joined</label>
                            <p className="detail-value">
                                {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .profile-details {
          display: grid;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .detail-group label {
          font-weight: 500;
          color: #dad2d2;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 0.25rem;
        }
        .detail-value {
          font-size: 1.1rem;
          color: #8e8a8a;
          font-weight: 600;
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .status-badge.safe {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-badge.warning {
            background-color: #fef3c7;
            color: #92400e;
        }
      `}</style>
        </>
    );
}