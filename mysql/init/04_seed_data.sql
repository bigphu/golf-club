-- ==========================================================
-- GOLF CLUB MANAGEMENT SYSTEM - SEED DATA
-- ==========================================================
USE golf;

-- 1. Create Users (Current Password for all: "hash123")
-- Admin
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, bio, profile_pic_url, background_color_hex) 
VALUES (1, 'admin@golf.com', '$2b$10$8FAjEsay4MImp8eBtDG/FuRQMNGgPkz5iVT9D.kkGInswjZD0j0Rm', 'Alice', 'Admin', '0909123456', 'Club Manager', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', '#ef4444');

-- Member 1
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, vga_number, shirt_size, profile_pic_url, background_color_hex) 
VALUES (2, 'vinh@test.com', '$2b$10$8FAjEsay4MImp8eBtDG/FuRQMNGgPkz5iVT9D.kkGInswjZD0j0Rm', 'Vinh', 'Nguyen', '0929093999', '990990', 'L', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400', '#3b82f6');
-- Member 2
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, vga_number, shirt_size, profile_pic_url, background_color_hex) 
VALUES (3, 'windy@test.com', '$2b$10$8FAjEsay4MImp8eBtDG/FuRQMNGgPkz5iVT9D.kkGInswjZD0j0Rm', 'Windy', 'Tran', '0909111222', '071054', 'XL', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', '#10b981');

-- Member 3
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, vga_number, shirt_size, profile_pic_url, background_color_hex) 
VALUES (4, 'david@test.com', '$2b$10$8FAjEsay4MImp8eBtDG/FuRQMNGgPkz5iVT9D.kkGInswjZD0j0Rm', 'David', 'Kim', '0909123888', '112233', 'M', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', '#f59e0b');
-- 2. Assign Roles
INSERT INTO admins (admin_id) VALUES (1);
INSERT INTO members (member_id) VALUES (2), (3), (4);

-- 3. Create Tournaments
-- Tournament 1 (Upcoming)
INSERT INTO tournaments (creator_id, name, description, location, start_date, end_date, format, max_participants, entry_fee, status, image_url)
VALUES (
    1, 
    'Saigon Charity Open 2025', 
    'Annual charity event for local community support.', 
    'Tan Son Nhat Golf Course',
    '2025-06-15 07:00:00', '2025-06-15 14:00:00',
    'Scramble', 144, 150.00, 'UPCOMING',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800'
);

-- Tournament 2 (Ongoing)
INSERT INTO tournaments (creator_id, name, description, location, start_date, end_date, format, max_participants, entry_fee, status, image_url)
VALUES (
    1, 
    'Weekend Club Championship', 
    'Competitive stroke play for club ranking.', 
    'Long Thanh Golf Club',
    '2025-05-20 06:30:00', '2025-05-21 18:00:00',
    'Stroke Play', 72, 200.00, 'ONGOING',
    'https://images.unsplash.com/photo-1592919505780-30395071e635?w=800'
);

-- 4. Register Participants
INSERT INTO tournament_participants (tournament_id, user_id, status) VALUES (1, 2, 'APPROVED'); -- Vinh approved
INSERT INTO tournament_participants (tournament_id, user_id, status) VALUES (1, 3, 'PENDING');  -- Windy pending
INSERT INTO tournament_participants (tournament_id, user_id, status) VALUES (2, 4, 'APPROVED'); -- David approved in ongoing

-- 5. Create Content
INSERT INTO notifications (title, content, author_id) VALUES ('Course Maintenance', 'Greens will be aerated next Monday.', 1);
INSERT INTO documents (title, type, author_id) VALUES ('2025 Club Rulebook', 'BCN_BYLAW', 1);