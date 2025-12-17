USE golf;

DROP PROCEDURE IF EXISTS register_user;
DROP PROCEDURE IF EXISTS process_membership_request;
DROP PROCEDURE IF EXISTS create_tournament;
DROP PROCEDURE IF EXISTS process_tournament_application;
DROP PROCEDURE IF EXISTS unregister_participant;
DROP PROCEDURE IF EXISTS update_score;
DROP PROCEDURE IF EXISTS get_leaderboard;
DROP PROCEDURE IF EXISTS apply_for_tournament;
DROP PROCEDURE IF EXISTS get_user_tournaments;

DELIMITER //

-- 1. Register a new user (Now accepts Bio)
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_last_name VARCHAR(50),
    IN p_first_name VARCHAR(50),
    IN p_phone VARCHAR(20),
    IN p_bio TEXT,  -- NEW PARAMETER
    IN p_profile_pic VARCHAR(255),
    IN p_bg_color VARCHAR(7)
)
BEGIN
    DECLARE new_user_id INT;
    
    START TRANSACTION;
        INSERT INTO users (email, password_hash, last_name, first_name, phone_number, bio, profile_pic_url, background_color_hex)
        VALUES (p_email, p_password_hash, p_last_name, p_first_name, p_phone, p_bio, p_profile_pic, p_bg_color);
        
        SET new_user_id = LAST_INSERT_ID();
        
        INSERT INTO membership_requests (user_id) VALUES (new_user_id);
    COMMIT;
END //

-- (Procedures 2-9 remain unchanged, omitted for brevity but should be included in full execution)
-- 2. Approve or Reject a membership request
CREATE PROCEDURE process_membership_request(
    IN p_request_id INT,
    IN p_admin_id INT,
    IN p_status ENUM('APPROVED', 'REJECTED'),
    IN p_comment TEXT
)
BEGIN
    UPDATE membership_requests 
    SET status = p_status, 
        processed_by = p_admin_id,
        admin_comment = p_comment
    WHERE request_id = p_request_id;
END //

-- 3. Create a new tournament
CREATE PROCEDURE create_tournament(
    IN p_name VARCHAR(200),
    IN p_description TEXT,
    IN p_admin_id INT
)
BEGIN
    INSERT INTO tournaments (name, description, created_by)
    VALUES (p_name, p_description, p_admin_id);
END //

-- 4. Manage Tournament Applications
CREATE PROCEDURE process_tournament_application(
    IN p_registration_id INT,
    IN p_status ENUM('APPROVED', 'REJECTED')
)
BEGIN
    UPDATE tournament_registrations 
    SET status = p_status 
    WHERE registration_id = p_registration_id;
END //

-- 5. Unregister a Participant
CREATE PROCEDURE unregister_participant(
    IN p_tournament_id INT,
    IN p_member_id INT
)
BEGIN
    DELETE FROM tournament_registrations 
    WHERE tournament_id = p_tournament_id AND member_id = p_member_id;
END //

-- 6. Update Player Score
CREATE PROCEDURE update_score(
    IN p_tournament_id INT,
    IN p_member_id INT,
    IN p_score INT
)
BEGIN
    UPDATE tournament_registrations
    SET score = p_score
    WHERE tournament_id = p_tournament_id 
      AND member_id = p_member_id 
      AND status = 'APPROVED'; 
END //

-- 7. Get Tournament Leaderboard
CREATE PROCEDURE get_leaderboard(
    IN p_tournament_id INT,
    IN p_limit INT
)
BEGIN
    SELECT 
        u.first_name,
        u.last_name,
        u.profile_pic_url,
        tr.score,
        RANK() OVER (ORDER BY tr.score ASC) as ranking
    FROM tournament_registrations tr
    JOIN members m ON tr.member_id = m.member_id
    JOIN users u ON m.member_id = u.user_id
    WHERE tr.tournament_id = p_tournament_id 
      AND tr.status = 'APPROVED'
      AND tr.score IS NOT NULL
    ORDER BY tr.score ASC 
    LIMIT p_limit;
END //

-- 8. User Apply for Tournament
CREATE PROCEDURE apply_for_tournament(
    IN p_tournament_id INT,
    IN p_member_id INT
)
BEGIN
    IF EXISTS (
        SELECT 1 FROM tournament_registrations 
        WHERE tournament_id = p_tournament_id AND member_id = p_member_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You have already applied for this tournament.';
    ELSE
        INSERT INTO tournament_registrations (tournament_id, member_id, status)
        VALUES (p_tournament_id, p_member_id, 'PENDING');
    END IF;
END //

-- 9. Get User's Tournament History
CREATE PROCEDURE get_user_tournaments(
    IN p_member_id INT
)
BEGIN
    SELECT 
        t.tournament_id,
        t.name AS tournament_name,
        t.status AS tournament_status,
        tr.status AS application_status,
        tr.score,
        tr.registered_at
    FROM tournament_registrations tr
    JOIN tournaments t ON tr.tournament_id = t.tournament_id
    WHERE tr.member_id = p_member_id
    ORDER BY tr.registered_at DESC;
END //

DELIMITER ;