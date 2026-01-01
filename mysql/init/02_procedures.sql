-- ==========================================================
-- GOLF CLUB MANAGEMENT SYSTEM - STORED PROCEDURES
-- ==========================================================
USE golf;
DELIMITER //

-- ----------------------------------------------------------
-- A. USER MANAGEMENT
-- ----------------------------------------------------------

DROP PROCEDURE IF EXISTS register_user //
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(100), IN p_password_hash VARCHAR(255),
    IN p_last_name VARCHAR(50), IN p_first_name VARCHAR(50),
    IN p_phone VARCHAR(20), IN p_vga_number VARCHAR(20),       
    IN p_shirt_size VARCHAR(5), IN p_bio TEXT,
    IN p_profile_pic_url VARCHAR(255), IN p_background_color_hex VARCHAR(7)
)
BEGIN
	DECLARE v_new_user_id INT;
    
    -- 1. Create the User Account
    INSERT INTO users (email, password_hash, last_name, first_name, phone_number, vga_number, shirt_size, bio, profile_pic_url, background_color_hex)
    VALUES (p_email, p_password_hash, p_last_name, p_first_name, p_phone, p_vga_number, p_shirt_size, p_bio, IFNULL(p_profile_pic_url, 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'), IFNULL(p_background_color_hex, '#64748b'));
    
    SET v_new_user_id = LAST_INSERT_ID();

    -- 2. Add to Membership Request Queue (Default status is 'PENDING')
    INSERT INTO membership_requests (user_id, status) 
    VALUES (v_new_user_id, 'PENDING');

    -- 3. Return the new user profile (Standard behavior for the frontend)
    SELECT * FROM users WHERE user_id = v_new_user_id;
END //

DROP PROCEDURE IF EXISTS get_user_full_profile //
CREATE PROCEDURE get_user_full_profile(IN p_user_id INT)
BEGIN
    SELECT u.*,
        CASE WHEN a.admin_id IS NOT NULL THEN 'ADMIN' WHEN m.member_id IS NOT NULL THEN 'MEMBER' ELSE 'GUEST' END as role,
        (SELECT COUNT(*) FROM tournament_participants tp WHERE tp.user_id = u.user_id) as stat_tournaments,
        (SELECT COUNT(*) FROM document_reads dr WHERE dr.member_id = u.user_id) as stat_documents_read 
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.admin_id
    LEFT JOIN members m ON u.user_id = m.member_id
    WHERE u.user_id = p_user_id;
END //

DROP PROCEDURE IF EXISTS update_user_profile //
CREATE PROCEDURE update_user_profile(
    IN p_user_id INT, IN p_first_name VARCHAR(50), IN p_last_name VARCHAR(50),
    IN p_phone VARCHAR(20), IN p_vga_number VARCHAR(20), IN p_shirt_size VARCHAR(5),
    IN p_bio TEXT, IN p_profile_pic_url VARCHAR(255), IN p_bg_color VARCHAR(7)
)
BEGIN
    UPDATE users SET first_name=p_first_name, last_name=p_last_name, phone_number=p_phone, vga_number=p_vga_number, shirt_size=p_shirt_size, bio=p_bio, profile_pic_url=p_profile_pic_url, background_color_hex=p_bg_color WHERE user_id=p_user_id;
    CALL get_user_full_profile(p_user_id);
END //

DROP PROCEDURE IF EXISTS get_directory_users //
CREATE PROCEDURE get_directory_users()
BEGIN
    SELECT u.user_id, u.email, u.first_name, u.last_name, u.phone_number, u.bio, u.profile_pic_url, u.background_color_hex,
        CASE WHEN a.admin_id IS NOT NULL THEN 'ADMIN' WHEN m.member_id IS NOT NULL THEN 'MEMBER' ELSE 'GUEST' END as role
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.admin_id
    LEFT JOIN members m ON u.user_id = m.member_id
    ORDER BY u.last_name ASC;
END //

-- ----------------------------------------------------------
-- B. TOURNAMENT MANAGEMENT
-- ----------------------------------------------------------

DROP PROCEDURE IF EXISTS create_tournament //
CREATE PROCEDURE create_tournament(
    IN p_creator_id INT,
    IN p_name VARCHAR(100),
    IN p_description TEXT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME,
    IN p_location VARCHAR(255),
    IN p_max_participants INT,
    IN p_entry_fee DECIMAL(10, 2),
    IN p_format VARCHAR(50),
    IN p_image_url VARCHAR(255) -- <--- The 10th Argument
)
BEGIN
    INSERT INTO tournaments (
        creator_id, name, description, start_date, end_date, 
        location, max_participants, entry_fee, format, image_url, 
        status
    ) VALUES (
        p_creator_id, p_name, p_description, p_start_date, p_end_date, 
        p_location, p_max_participants, p_entry_fee, p_format, 
        IFNULL(p_image_url, 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800'), 
        'UPCOMING'
    );
    
    -- Auto-register the creator as a participant (Approved)
    INSERT INTO tournament_participants (tournament_id, user_id, status)
    VALUES (LAST_INSERT_ID(), p_creator_id, 'APPROVED');
END //

DROP PROCEDURE IF EXISTS get_tournaments_view //
CREATE PROCEDURE get_tournaments_view(IN p_status VARCHAR(20))
BEGIN
    SELECT t.*, CONCAT(u.first_name, ' ', u.last_name) as creator_name 
    FROM tournaments t JOIN users u ON t.creator_id = u.user_id
    WHERE (p_status IS NULL OR t.status = p_status) ORDER BY t.created_at DESC;
END //

DROP PROCEDURE IF EXISTS get_my_tournaments //
CREATE PROCEDURE get_my_tournaments(IN p_user_id INT)
BEGIN
    SELECT DISTINCT t.*, CONCAT(u.first_name, ' ', u.last_name) as creator_name, tp.status as my_status
    FROM tournaments t
    JOIN users u ON t.creator_id = u.user_id
    -- Use LEFT JOIN to check if the specific user is a participant
    LEFT JOIN tournament_participants tp ON t.tournament_id = tp.tournament_id AND tp.user_id = p_user_id
    -- Filter: Keep if User is the Creator OR User is found in participants
    WHERE t.creator_id = p_user_id OR tp.user_id IS NOT NULL
    ORDER BY t.start_date DESC;
END //

DROP PROCEDURE IF EXISTS get_tournament_details //
CREATE PROCEDURE get_tournament_details(IN p_tournament_id INT)
BEGIN
    SELECT t.*, CONCAT(u.first_name, ' ', u.last_name) as creator_name,
        (SELECT COUNT(*) FROM tournament_participants WHERE tournament_id = p_tournament_id AND status = 'APPROVED') as current_participants
    FROM tournaments t JOIN users u ON t.creator_id = u.user_id WHERE t.tournament_id = p_tournament_id;
END //

DROP PROCEDURE IF EXISTS get_tournament_participants //
CREATE PROCEDURE get_tournament_participants(IN p_tournament_id INT)
BEGIN
    SELECT u.user_id, u.first_name, u.last_name, u.profile_pic_url, u.background_color_hex, u.bio, u.email, tp.status, tp.created_at as registered_at
    FROM tournament_participants tp JOIN users u ON tp.user_id = u.user_id
    WHERE tp.tournament_id = p_tournament_id
    ORDER BY FIELD(tp.status, 'PENDING', 'APPROVED', 'REJECTED'), tp.created_at DESC;
END //

DROP PROCEDURE IF EXISTS apply_for_tournament //
CREATE PROCEDURE apply_for_tournament(IN p_tournament_id INT, IN p_user_id INT)
BEGIN
    DECLARE v_status VARCHAR(20);
    DECLARE v_is_eligible BOOLEAN DEFAULT FALSE;
    
    -- 1. Check Tournament Status
    SELECT status INTO v_status FROM tournaments WHERE tournament_id = p_tournament_id;
    
    IF v_status != 'UPCOMING' THEN 
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tournament is closed or not upcoming.'; 
    END IF;
    
    -- 2. Check Eligibility (Must be in 'members' OR 'admins' table)
    IF EXISTS (SELECT 1 FROM members WHERE member_id = p_user_id) OR 
       EXISTS (SELECT 1 FROM admins WHERE admin_id = p_user_id) THEN
        SET v_is_eligible = TRUE;
    END IF;

    -- 3. Throw Error if not eligible
    IF v_is_eligible = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Access Denied: Only Members or Admins can participate in tournaments.';
    END IF;
    
    -- 4. Proceed with Registration
    INSERT INTO tournament_participants (tournament_id, user_id, status) 
    VALUES (p_tournament_id, p_user_id, 'PENDING');
END //

DROP PROCEDURE IF EXISTS manage_tournament_application //
CREATE PROCEDURE manage_tournament_application(
    IN p_admin_id INT, IN p_tournament_id INT, IN p_target_user_id INT, IN p_status ENUM('PENDING', 'APPROVED', 'REJECTED')
)
BEGIN
    UPDATE tournament_participants SET status = p_status, updated_at = NOW()
    WHERE tournament_id = p_tournament_id AND user_id = p_target_user_id;
END //

-- ----------------------------------------------------------
-- C. CONTENT VIEWS
-- ----------------------------------------------------------

DROP PROCEDURE IF EXISTS get_documents_view //
CREATE PROCEDURE get_documents_view()
BEGIN
    SELECT d.*, CONCAT(u.first_name, ' ', u.last_name) as author_name 
    FROM documents d JOIN users u ON d.author_id = u.user_id ORDER BY d.created_at DESC;
END //

DROP PROCEDURE IF EXISTS get_notifications_view //
CREATE PROCEDURE get_notifications_view()
BEGIN
    SELECT n.*, CONCAT(u.first_name, ' ', u.last_name) as author_name 
    FROM notifications n JOIN users u ON n.author_id = u.user_id ORDER BY n.created_at DESC;
END //

-- ----------------------------------------------------------
-- D. MEMBERSHIP MANAGEMENT (NEW)
-- ----------------------------------------------------------

DROP PROCEDURE IF EXISTS get_pending_membership_requests //
CREATE PROCEDURE get_pending_membership_requests()
BEGIN
    SELECT 
        mr.request_id,
        mr.user_id,
        mr.status,
        mr.created_at as registered_at,
        u.first_name,
        u.last_name,
        u.email,
        u.profile_pic_url,
        u.vga_number,
        u.background_color_hex,
        u.shirt_size
    FROM membership_requests mr
    JOIN users u ON mr.user_id = u.user_id
    WHERE mr.status = 'PENDING'
    ORDER BY mr.created_at ASC;
END //

DROP PROCEDURE IF EXISTS process_membership_request //
CREATE PROCEDURE process_membership_request(
    IN p_admin_id INT,
    IN p_request_id INT,
    IN p_status ENUM('APPROVED', 'REJECTED'),
    IN p_comment TEXT
)
BEGIN
    DECLARE v_user_id INT;
    
    -- 1. Get the user_id associated with this request
    SELECT user_id INTO v_user_id FROM membership_requests WHERE request_id = p_request_id;
    
    -- 2. Update the request status
    UPDATE membership_requests 
    SET status = p_status, 
        processed_by = p_admin_id, 
        admin_comment = p_comment 
    WHERE request_id = p_request_id;
    
    -- 3. If Approved, insert into members table (Promote from Guest)
    IF p_status = 'APPROVED' THEN
        INSERT IGNORE INTO members (member_id) VALUES (v_user_id);
    END IF;
    
    -- 4. Return the updated user ID for confirmation
    SELECT v_user_id as processed_user_id;
END //

-- Add this to 02_procedures.sql
DROP PROCEDURE IF EXISTS update_tournament //
CREATE PROCEDURE update_tournament(
    IN p_tournament_id INT,
    IN p_name VARCHAR(200),
    IN p_description TEXT,
    IN p_location VARCHAR(255),
    IN p_start_date DATETIME,
    IN p_end_date DATETIME,
    IN p_format VARCHAR(50),
    IN p_max_participants INT,
    IN p_entry_fee DECIMAL(15, 2),
    IN p_image_url VARCHAR(255)
)
BEGIN
    UPDATE tournaments 
    SET 
        name = p_name,
        description = p_description,
        location = p_location,
        start_date = p_start_date,
        end_date = p_end_date,
        format = p_format,
        max_participants = p_max_participants,
        entry_fee = p_entry_fee,
        image_url = p_image_url
    WHERE tournament_id = p_tournament_id;
    
    -- Return updated details
    CALL get_tournament_details(p_tournament_id);
END //

DELIMITER ;