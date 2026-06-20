-- Seed sample events for demo
INSERT INTO events (title, description, location, category, start_date, end_date, price, capacity, available_slots, image_url, status, featured, venue_name, venue_address, latitude, longitude, booking_count)
SELECT 'Tech Summit 2026', 'Join industry leaders for the biggest technology conference of the year. Keynotes, workshops, and networking.', 'Bangalore, India', 'Tech', NOW() + INTERVAL '30 days', NOW() + INTERVAL '30 days' + INTERVAL '8 hours', 999.00, 500, 500, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'PUBLISHED', TRUE, 'Bangalore Convention Center', 'MG Road, Bangalore', 12.9716, 77.5946, 45
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Tech Summit 2026');

INSERT INTO events (title, description, location, category, start_date, end_date, price, capacity, available_slots, image_url, status, featured, venue_name, venue_address, latitude, longitude, booking_count)
SELECT 'Summer Music Festival', 'Experience live performances from top artists across genres. Food, drinks, and unforgettable memories.', 'Mumbai, India', 'Music', NOW() + INTERVAL '45 days', NOW() + INTERVAL '45 days' + INTERVAL '6 hours', 1499.00, 2000, 2000, 'https://images.unsplash.com/photo-1459742916374-632cb453928a?w=800', 'PUBLISHED', TRUE, 'Jio World Garden', 'Bandra Kurla Complex, Mumbai', 19.0596, 72.8656, 120
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Summer Music Festival');

INSERT INTO events (title, description, location, category, start_date, end_date, price, capacity, available_slots, image_url, status, featured, venue_name, venue_address, latitude, longitude, booking_count)
SELECT 'Startup Pitch Night', 'Watch emerging startups pitch to top VCs. Free entry for attendees.', 'Delhi, India', 'Business', NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '4 hours', 0.00, 300, 300, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 'PUBLISHED', FALSE, 'India Habitat Centre', 'Lodhi Road, New Delhi', 28.5892, 77.2273, 80
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Startup Pitch Night');

INSERT INTO events (title, description, location, category, start_date, end_date, price, capacity, available_slots, image_url, status, featured, venue_name, venue_address, seat_selection_enabled, booking_count)
SELECT 'Design Workshop', 'Hands-on UI/UX design workshop with industry experts. Limited seats available.', 'Hyderabad, India', 'Workshop', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days' + INTERVAL '5 hours', 499.00, 50, 50, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'PUBLISHED', FALSE, 'WeWork Hitech City', 'Hitech City, Hyderabad', TRUE, 25
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Design Workshop');

INSERT INTO events (title, description, location, category, start_date, end_date, price, capacity, available_slots, image_url, status, venue_name, booking_count)
SELECT 'Marathon 2026', 'Annual city marathon. 5K, 10K, and full marathon categories.', 'Chennai, India', 'Sports', NOW() + INTERVAL '60 days', NOW() + INTERVAL '60 days' + INTERVAL '6 hours', 299.00, 1000, 1000, 'https://images.unsplash.com/photo-1452626038307-9d2954eb1d0f?w=800', 'PUBLISHED', 'Marina Beach Road', 60
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Marathon 2026');
