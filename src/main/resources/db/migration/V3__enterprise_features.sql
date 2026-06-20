-- ROLE_ORGANIZER
INSERT INTO roles (name) VALUES ('ROLE_ORGANIZER') ON CONFLICT (name) DO NOTHING;

-- USERS extensions
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_url VARCHAR(512);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_push BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_reminders BOOLEAN DEFAULT TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL AND deleted = FALSE;

-- EVENTS extensions
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES users(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255);
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_address TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_images TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS faqs TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS schedule TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS seat_selection_enabled BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id) WHERE deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured) WHERE deleted = FALSE;

-- BOOKINGS extensions
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS selected_seats TEXT;

-- PAYMENTS extensions
ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gst_amount DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);

-- TICKETS extensions
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS seat_label VARCHAR(20);
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS qr_data TEXT;

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

-- REFUNDS
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES payments(id),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

-- WISHLIST
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- RECENTLY VIEWED
CREATE TABLE IF NOT EXISTS event_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_views_user ON event_views(user_id, viewed_at DESC);

-- EVENT SEATS
CREATE TABLE IF NOT EXISTS event_seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    seat_label VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    booking_id UUID REFERENCES bookings(id),
    UNIQUE(event_id, seat_label)
);

-- Unique review per user per event
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_event ON reviews(user_id, event_id) WHERE deleted = FALSE;

-- Seed sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, max_uses, valid_until, active)
VALUES
('WELCOME10', 'Welcome discount 10%', 'PERCENTAGE', 10, 1000, NOW() + INTERVAL '1 year', TRUE),
('FLAT100', 'Flat Rs 100 off', 'FIXED', 100, 500, NOW() + INTERVAL '6 months', TRUE)
ON CONFLICT (code) DO NOTHING;
