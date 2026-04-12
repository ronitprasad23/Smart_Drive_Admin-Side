

-- Create the core user table (mapped to accounts.User)
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(150) UNIQUE NOT NULL,
    email VARCHAR(254),
    password VARCHAR(128) NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    full_name VARCHAR(150),
    is_staff BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    date_joined TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Custom Smart Drive Fields
    license_number VARCHAR(50),
    dob DATE,
    persona VARCHAR(20) DEFAULT 'Normal',
    mobile_number VARCHAR(20),
    emergency_contact VARCHAR(20),
    profile_image TEXT,
    issue_date DATE,
    license_type VARCHAR(20)
);

-- Users table (Application Users / Drivers)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone_number VARCHAR(15),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'driver',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Contacts table
CREATE TABLE accounts_emergencycontact (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    relation VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 3. VEHICLES & TRIPS
-- ---------------------------------------------------------

-- Vehicles table
CREATE TABLE vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    start_location VARCHAR(255),
    end_location VARCHAR(255),
    distance_km FLOAT DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'ONGOING', -- ONGOING, COMPLETED, CANCELLED, SCHEDULED
    
    -- Feedback Fields
    rating INT,
    feedback TEXT,
    alert_helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- 4. ALERTS DEFINITIONS & LOGS
-- ---------------------------------------------------------

-- Alert Definitions table (seed data included below)
CREATE TABLE alerts_alert (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Trip Alerts table (Logs generated during a trip)
CREATE TABLE alerts_tripalert (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
    trip_id INT REFERENCES trips(trip_id) ON DELETE CASCADE,
    alert_type_id INT NOT NULL REFERENCES alerts_alert(id) ON DELETE CASCADE,
    severity VARCHAR(20) DEFAULT 'MODERATE_RISK', -- MINOR_RISK, MODERATE_RISK, CRITICAL_RISK
    vehicle_speed FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT,
    is_resolved BOOLEAN DEFAULT FALSE
);

-- ---------------------------------------------------------
-- 5. SYSTEM SETTINGS
-- ---------------------------------------------------------

CREATE TABLE system_settings_systemsetting (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
