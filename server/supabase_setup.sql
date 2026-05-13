-- ============================================================
-- ParkShare — Supabase Setup SQL
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ── 1. TABLES ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255),
  phone           VARCHAR(30),
  bio             TEXT,
  avatar_url      TEXT,
  role            VARCHAR(20)   NOT NULL DEFAULT 'driver' CHECK (role IN ('driver','host','admin')),
  google_id       VARCHAR(120)  UNIQUE,
  onboarded       BOOLEAN       NOT NULL DEFAULT FALSE,
  nid             VARCHAR(100),
  license_plate   VARCHAR(50),
  kyc_status      VARCHAR(20)   NOT NULL DEFAULT 'pending',
  vehicle_make    VARCHAR(80),
  vehicle_model   VARCHAR(80),
  vehicle_color   VARCHAR(50),
  vehicle_size    VARCHAR(20),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS spots (
  id              SERIAL PRIMARY KEY,
  host_id         INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(160)  NOT NULL,
  description     TEXT,
  address         VARCHAR(300)  NOT NULL,
  latitude        NUMERIC(10,7) NOT NULL,
  longitude       NUMERIC(10,7) NOT NULL,
  hourly_price    NUMERIC(8,2)  NOT NULL,
  vehicle_size    VARCHAR(30)   NOT NULL DEFAULT 'sedan' CHECK (vehicle_size IN ('sedan','suv','van','truck')),
  rules           TEXT,
  available_from  TIME,
  available_to    TIME,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  images          TEXT[]        NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id                SERIAL PRIMARY KEY,
  spot_id           INTEGER       NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  driver_id         INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time        TIMESTAMPTZ   NOT NULL,
  end_time          TIMESTAMPTZ   NOT NULL,
  total_price       NUMERIC(8,2)  NOT NULL,
  status            VARCHAR(20)   NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','paid','active','completed','cancelled')),
  stripe_payment_id VARCHAR(120),
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
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
  stripe_id   VARCHAR(120) UNIQUE,
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

CREATE TABLE IF NOT EXISTS kyc_whitelist (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(20)  NOT NULL CHECK (type IN ('nid','license_plate')),
  value       VARCHAR(100) NOT NULL UNIQUE,
  note        TEXT,
  added_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  nid_id      INTEGER REFERENCES kyc_whitelist(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── 2. INDEXES ──────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_spots_host      ON spots(host_id);
CREATE INDEX IF NOT EXISTS idx_spots_location  ON spots(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_driver ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_spot   ON bookings(spot_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_notif_user      ON notifications(user_id);

-- ── 3. DISABLE ROW LEVEL SECURITY ───────────────────────────
-- App uses its own JWT auth; PostgREST anon key gets full access via grants below.

ALTER TABLE users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE spots          DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions   DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  DISABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_whitelist  DISABLE ROW LEVEL SECURITY;

-- ── 4. GRANTS ───────────────────────────────────────────────

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ── 5. VIEWS ────────────────────────────────────────────────

-- v_spots: spots enriched with host info and aggregate ratings
CREATE OR REPLACE VIEW v_spots AS
SELECT
  s.id, s.host_id, s.title, s.description, s.address,
  s.latitude, s.longitude, s.hourly_price, s.vehicle_size,
  s.rules, s.available_from, s.available_to, s.is_active,
  s.images, s.created_at,
  u.name  AS host_name,
  u.phone AS host_phone,
  COALESCE(AVG(r.rating), 0)::FLOAT AS avg_rating,
  COUNT(DISTINCT r.id)              AS review_count,
  COUNT(DISTINCT b.id)              AS booking_count
FROM spots s
JOIN users u ON u.id = s.host_id
LEFT JOIN bookings b ON b.spot_id = s.id
LEFT JOIN reviews  r ON r.booking_id = b.id
GROUP BY s.id, u.name, u.phone;

-- v_bookings: bookings joined with spot, driver, and host details
CREATE OR REPLACE VIEW v_bookings AS
SELECT
  b.id, b.spot_id, b.driver_id, b.start_time, b.end_time,
  b.total_price, b.status, b.stripe_payment_id, b.created_at,
  s.title   AS spot_title,
  s.address AS spot_address,
  s.latitude, s.longitude, s.hourly_price,
  d.name  AS driver_name,
  d.email AS driver_email,
  d.phone AS driver_phone,
  h.id    AS host_id,
  h.name  AS host_name,
  h.email AS host_email,
  h.phone AS host_phone
FROM bookings b
JOIN spots s ON s.id = b.spot_id
JOIN users  d ON d.id = b.driver_id
JOIN users  h ON h.id = s.host_id;

-- v_reviews: reviews with reviewer/reviewee names and spot title
CREATE OR REPLACE VIEW v_reviews AS
SELECT
  r.id, r.booking_id, r.reviewer_id, r.reviewee_id,
  r.rating, r.comment, r.created_at,
  u.name  AS reviewer_name,
  rv.name AS reviewee_name,
  b.spot_id,
  s.title AS spot_title
FROM reviews  r
JOIN users    u  ON u.id  = r.reviewer_id
JOIN users    rv ON rv.id = r.reviewee_id
JOIN bookings b  ON b.id  = r.booking_id
JOIN spots    s  ON s.id  = b.spot_id;

-- v_transactions: transactions with booking/spot/driver details
CREATE OR REPLACE VIEW v_transactions AS
SELECT
  t.id, t.booking_id, t.amount, t.stripe_id, t.status, t.created_at,
  b.start_time, b.end_time,
  s.id      AS spot_id,
  s.host_id,
  s.title   AS spot_title,
  d.id      AS driver_id,
  d.name    AS driver_name
FROM transactions t
JOIN bookings b ON b.id  = t.booking_id
JOIN spots    s ON s.id  = b.spot_id
JOIN users    d ON d.id  = b.driver_id;

-- v_kyc_whitelist: KYC entries with added-by user name and linked NID value
CREATE OR REPLACE VIEW v_kyc_whitelist AS
SELECT
  k.id, k.type, k.value, k.note, k.added_by, k.nid_id, k.created_at,
  u.name  AS added_by_name,
  n.value AS linked_nid
FROM kyc_whitelist k
LEFT JOIN users          u ON u.id = k.added_by
LEFT JOIN kyc_whitelist  n ON n.id = k.nid_id;

-- Grant SELECT on views to anon/authenticated
GRANT SELECT ON v_spots, v_bookings, v_reviews, v_transactions, v_kyc_whitelist TO anon, authenticated;

-- ── 6. FUNCTIONS ────────────────────────────────────────────

-- search_spots: dynamic spot search with location + filter support
CREATE OR REPLACE FUNCTION search_spots(
  p_lat          DOUBLE PRECISION DEFAULT NULL,
  p_lng          DOUBLE PRECISION DEFAULT NULL,
  p_max_price    DOUBLE PRECISION DEFAULT NULL,
  p_min_rating   DOUBLE PRECISION DEFAULT NULL,
  p_vehicle_size TEXT             DEFAULT NULL,
  p_start_time   TIMESTAMPTZ      DEFAULT NULL,
  p_end_time     TIMESTAMPTZ      DEFAULT NULL,
  p_radius       DOUBLE PRECISION DEFAULT 5
)
RETURNS TABLE (
  id            INTEGER,
  host_id       INTEGER,
  title         VARCHAR,
  description   TEXT,
  address       VARCHAR,
  latitude      NUMERIC,
  longitude     NUMERIC,
  hourly_price  NUMERIC,
  vehicle_size  VARCHAR,
  rules         TEXT,
  available_from TIME,
  available_to   TIME,
  is_active      BOOLEAN,
  images         TEXT[],
  created_at     TIMESTAMPTZ,
  host_name      VARCHAR,
  host_phone     VARCHAR,
  avg_rating     DOUBLE PRECISION,
  review_count   BIGINT,
  booking_count  BIGINT
)
LANGUAGE plpgsql AS $$
DECLARE
  v_lat_delta DOUBLE PRECISION;
  v_lng_delta DOUBLE PRECISION;
BEGIN
  IF p_lat IS NOT NULL THEN
    v_lat_delta := p_radius / 111.0;
    v_lng_delta := p_radius / (111.0 * COS(p_lat * PI() / 180.0));
  END IF;

  RETURN QUERY
  SELECT
    s.id, s.host_id, s.title, s.description, s.address,
    s.latitude, s.longitude, s.hourly_price, s.vehicle_size,
    s.rules, s.available_from, s.available_to, s.is_active,
    s.images, s.created_at,
    u.name::VARCHAR,
    u.phone::VARCHAR,
    COALESCE(AVG(r.rating), 0)::DOUBLE PRECISION,
    COUNT(DISTINCT r.id),
    COUNT(DISTINCT bk.id)
  FROM spots s
  JOIN users    u  ON u.id = s.host_id
  LEFT JOIN bookings bk ON bk.spot_id = s.id
  LEFT JOIN reviews  r  ON r.booking_id = bk.id
  WHERE s.is_active = true
    AND (p_lat IS NULL OR s.latitude  BETWEEN p_lat - v_lat_delta AND p_lat + v_lat_delta)
    AND (p_lng IS NULL OR s.longitude BETWEEN p_lng - v_lng_delta AND p_lng + v_lng_delta)
    AND (p_max_price    IS NULL OR s.hourly_price <= p_max_price)
    AND (p_vehicle_size IS NULL OR s.vehicle_size = p_vehicle_size)
    AND (
      p_start_time IS NULL OR p_end_time IS NULL OR
      s.id NOT IN (
        SELECT spot_id FROM bookings
        WHERE status IN ('paid','active')
          AND start_time < p_end_time
          AND end_time   > p_start_time
      )
    )
  GROUP BY s.id, u.name, u.phone
  HAVING (p_min_rating IS NULL OR COALESCE(AVG(r.rating), 0) >= p_min_rating)
  ORDER BY COALESCE(AVG(r.rating), 0) DESC, s.hourly_price ASC
  LIMIT 100;
END;
$$;

-- check_booking_conflict: returns true if a conflicting booking exists
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_spot_id             INTEGER,
  p_start_time          TIMESTAMPTZ,
  p_end_time            TIMESTAMPTZ,
  p_exclude_booking_id  INTEGER DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM bookings
  WHERE spot_id  = p_spot_id
    AND status   IN ('approved','paid','active')
    AND start_time < p_end_time
    AND end_time   > p_start_time
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id);
  RETURN v_count > 0;
END;
$$;

-- get_total_revenue: sum of all paid transactions
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS NUMERIC
LANGUAGE plpgsql AS $$
BEGIN
  RETURN COALESCE((SELECT SUM(amount) FROM transactions WHERE status = 'paid'), 0);
END;
$$;

GRANT EXECUTE ON FUNCTION search_spots,check_booking_conflict,get_total_revenue TO anon, authenticated;
