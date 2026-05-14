-- ParkShare Database Schema
-- Run this against your Neon / Supabase PostgreSQL instance

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  phone       VARCHAR(30),
  bio         TEXT,
  avatar_url  TEXT,
  role        VARCHAR(20)   NOT NULL DEFAULT 'driver' CHECK (role IN ('driver','host','admin')),
  google_id   VARCHAR(120)  UNIQUE,
  onboarded   BOOLEAN       NOT NULL DEFAULT FALSE,
  nid         VARCHAR(30),
  license_plate VARCHAR(30),
  kyc_status  VARCHAR(20)   DEFAULT 'pending' CHECK (kyc_status IN ('pending','approved','rejected','resubmit_requested')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spots (
  id             SERIAL PRIMARY KEY,
  host_id        INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title          VARCHAR(160)  NOT NULL,
  description    TEXT,
  address        VARCHAR(300)  NOT NULL,
  latitude       NUMERIC(10,7) NOT NULL,
  longitude      NUMERIC(10,7) NOT NULL,
  hourly_price   NUMERIC(8,2)  NOT NULL,
  vehicle_size   VARCHAR(30)   NOT NULL DEFAULT 'sedan' CHECK (vehicle_size IN ('sedan','suv','van','truck')),
  rules          TEXT,
  available_from TIME,
  available_to   TIME,
  is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
  images         TEXT[]        NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id                 SERIAL PRIMARY KEY,
  spot_id            INTEGER       NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  driver_id          INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time         TIMESTAMPTZ   NOT NULL,
  end_time           TIMESTAMPTZ   NOT NULL,
  total_price        NUMERIC(8,2)  NOT NULL,
  status             VARCHAR(20)   NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','active','completed','cancelled')),
  stripe_payment_id  VARCHAR(120),
  created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id           SERIAL PRIMARY KEY,
  booking_id   INTEGER  NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id  INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id  INTEGER  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, reviewer_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id          SERIAL PRIMARY KEY,
  booking_id  INTEGER      NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount      NUMERIC(8,2) NOT NULL,
  stripe_id   VARCHAR(120),
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','refunded')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(60) NOT NULL,
  message     TEXT        NOT NULL,
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  link        VARCHAR(300),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_spots_host      ON spots(host_id);
CREATE INDEX IF NOT EXISTS idx_spots_location  ON spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_driver ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_spot   ON bookings(spot_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_notif_user      ON notifications(user_id);
