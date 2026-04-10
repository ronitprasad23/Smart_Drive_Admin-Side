export default function AccidentZones() {
  return (
    <>
      <h2 className="text-2xl font-bold text-white-800 mb-6">Accident Zones 🚧</h2>

      { }
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Zones</h4>
          <p className="stat-number">18</p>
        </div>

        <div className="stat-card">
          <h4>CRITICAL Risk</h4>
          <p className="stat-number danger">7</p>
        </div>

        <div className="stat-card">
          <h4>Moderate Risk</h4>
          <p className="stat-number warning">6</p>
        </div>

        <div className="stat-card">
          <h4>Minor Risk</h4>
          <p className="stat-number safe">5</p>
        </div>
      </div>

      { }
      <div className="card-section">
        <h3>Identified Accident Zones</h3>

        <table className="alert-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Location</th>
              <th>City</th>
              <th>Accidents</th>
              <th>Risk Level</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>SG Highway</td>
              <td>Ahmedabad</td>
              <td>42</td>
              <td className="danger">Critical</td>
              <td>
                <button className="btn-view">View</button>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Ring Road</td>
              <td>Surat</td>
              <td>27</td>
              <td className="warning">Moderate</td>
              <td>
                <button className="btn-view">View</button>
              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>Raopura</td>
              <td>Vadodara</td>
              <td>12</td>
              <td className="safe">Minor</td>
              <td>
                <button className="btn-view">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      { }
      <div className="info-box">
        ⚠ These zones are identified based on historical accident data
        and AI risk analysis.
      </div>
    </>
  );
}