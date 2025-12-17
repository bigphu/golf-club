USE golf;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE tournament_registrations;
TRUNCATE TABLE tournaments;
TRUNCATE TABLE notification_receipts;
TRUNCATE TABLE document_reads;
TRUNCATE TABLE notifications;
TRUNCATE TABLE documents;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE membership_requests;
TRUNCATE TABLE admins;
TRUNCATE TABLE members;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 2. CREATE USERS (With Bio)
-- Password: 123456
-- ==========================================
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, bio, profile_pic_url, background_color_hex) VALUES 
(1, 'admin@golfclub.com', '123456', 'Alice', 'Admin', '555-0101', 'Chief organizer and system administrator.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', '#4F46E5'),
(2, 'sec@golfclub.com', '123456', 'Bob', 'Builder', '555-0102', 'Club Secretary handling membership and events.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', '#10B981'),
(3, 'tiger@golf.com', '123456', 'Tiger', 'Woods-ish', '555-0201', 'Professional golfer. 15-time major winner.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tiger', '#F59E0B'),
(4, 'rory@golf.com', '123456', 'Rory', 'McIlroy-ish', '555-0202', 'Always chasing the green jacket.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rory', '#EF4444'),
(5, 'member1@test.com', '123456', 'Charlie', 'Chipper', '555-0301', 'Enjoys weekend rounds with friends.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', '#3B82F6'),
(6, 'member2@test.com', '123456', 'Danny', 'Driver', '555-0302', 'Long driver champion 2023.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Danny', '#8B5CF6'),
(7, 'member3@test.com', '123456', 'Eve', 'Eagle', '555-0303', 'Hoping for a hole in one this year.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve', '#EC4899'),
(8, 'newbie@test.com', '123456', 'Frank', 'Fairway', '555-0304', 'Just started playing golf last month.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank', '#6B7280');

-- ==========================================
-- 3. ASSIGN ROLES
-- ==========================================
INSERT INTO admins (admin_id) VALUES (1), (2);
INSERT INTO members (member_id) VALUES (3), (4), (5), (6), (7);

INSERT INTO membership_requests (user_id, status, processed_by, admin_comment) VALUES 
(1, 'APPROVED', 1, 'System Admin'),
(2, 'APPROVED', 1, 'System Admin'),
(3, 'APPROVED', 1, 'Welcome Tiger!'),
(4, 'APPROVED', 1, 'Welcome Rory!'),
(5, 'APPROVED', 2, 'Good standing'),
(6, 'APPROVED', 2, 'Paid dues'),
(7, 'APPROVED', 2, 'Legacy member'),
(8, 'PENDING', NULL, NULL);

-- ==========================================
-- 4. CONTENT & TOURNAMENTS
-- ==========================================
INSERT INTO documents (title, type, author_id) VALUES ('Club Constitution 2024', 'BCN_BYLAW', 1), ('Gold Member Benefits', 'BENEFIT', 1);
INSERT INTO notifications (title, content, author_id) VALUES ('Greens Aeration', 'The greens will be aerated next Monday.', 1), ('Holiday Party', 'Join us for the annual Christmas dinner.', 2);

INSERT INTO tournaments (tournament_id, name, description, status, created_by) VALUES (100, 'Summer Open 2024', 'Sunny weather expected.', 'UPCOMING', 1);
INSERT INTO tournament_registrations (tournament_id, member_id, status) VALUES (100, 3, 'APPROVED'), (100, 4, 'APPROVED');
UPDATE tournaments SET status = 'FINISHED' WHERE tournament_id = 100;
UPDATE tournament_registrations SET score = 68 WHERE tournament_id = 100 AND member_id = 3; 
UPDATE tournament_registrations SET score = 70 WHERE tournament_id = 100 AND member_id = 4;

INSERT INTO tournaments (tournament_id, name, description, status, created_by) VALUES (101, 'Club Championship', 'The big one.', 'UPCOMING', 2);