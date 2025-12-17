-- ==========================================================
-- GOLF CLUB MANAGEMENT SYSTEM - COMPLETE DATABASE
-- ==========================================================

DROP DATABASE IF EXISTS golf;
CREATE DATABASE golf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE golf;

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- 1. TABLES (SCHEMA)
-- ==========================================================

-- 1.1 Base Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    -- Specific fields for Golf Registration
    vga_number VARCHAR(20) DEFAULT NULL,            
    shirt_size ENUM('S','M','L','XL','XXL','XXXL') DEFAULT NULL, 
    bio TEXT DEFAULT NULL,
    profile_pic_url VARCHAR(255) DEFAULT 'default_avatar.png',
    background_color_hex VARCHAR(7) DEFAULT '#64748b', -- Default Slate
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1.2 Roles
CREATE TABLE members (
    member_id INT PRIMARY KEY,
    FOREIGN KEY (member_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE admins (
    admin_id INT PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 1.3 Membership Requests
CREATE TABLE membership_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    admin_comment TEXT,
    processed_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES admins(admin_id)
);

-- 1.4 Promotions & Benefits
CREATE TABLE promotions (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    discount_amount VARCHAR(100), 
    image_url VARCHAR(255),
    valid_from DATE,
    valid_to DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 1.5 Content Tables (Documents & Notifications)
CREATE TABLE documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT, -- Added content column for storing text or link
    type ENUM('BCN_BYLAW', 'BENEFIT') NOT NULL,
    author_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES admins(admin_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES admins(admin_id)
);

-- 1.6 Tournaments
CREATE TABLE tournaments (
    tournament_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) DEFAULT 'default_tournament.jpg', 
    location VARCHAR(255) NOT NULL DEFAULT 'TBD',
    shotgun_time TIME DEFAULT NULL, 
    max_players INT DEFAULT 144,
    fee_member DECIMAL(15,2) DEFAULT 0,
    fee_guest DECIMAL(15,2) DEFAULT 0,
    bank_info TEXT,                 
    status ENUM('UPCOMING', 'ONGOING', 'FINISHED', 'CANCELED') DEFAULT 'UPCOMING',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id)
);

CREATE TABLE tournament_registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    member_id INT NOT NULL, 
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
    payment_amount DECIMAL(15,2) DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'TRANSFER',
    registered_shirt_size VARCHAR(5), 
    score INT DEFAULT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (tournament_id, member_id)
);

CREATE TABLE tournament_prizes (
    prize_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    category VARCHAR(100), 
    description TEXT,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE
);

-- 1.7 Stats Tracking (Optional wrapper for logic)
CREATE TABLE document_reads (
    read_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    document_id INT NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(user_id),
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 2. STORED PROCEDURES
-- ==========================================================

DELIMITER //

-- ----------------------------------------------------------
-- A. USER MANAGEMENT & PROFILES (UPDATED)
-- ----------------------------------------------------------

-- 1. Register User (Write) - UPDATED TO INCLUDE VGA & SHIRT SIZE
DROP PROCEDURE IF EXISTS register_user //
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_last_name VARCHAR(50),
    IN p_first_name VARCHAR(50),
    IN p_phone VARCHAR(20),
    IN p_vga_number VARCHAR(20),       -- New
    IN p_shirt_size VARCHAR(5),        -- New
    IN p_bio TEXT,
    IN p_profile_pic_url VARCHAR(255),
    IN p_background_color_hex VARCHAR(7)
)
BEGIN
    INSERT INTO users (
        email, 
        password_hash, 
        last_name, 
        first_name, 
        phone_number,
        vga_number, 
        shirt_size, 
        bio, 
        profile_pic_url, 
        background_color_hex
    )
    VALUES (
        p_email, 
        p_password_hash, 
        p_last_name, 
        p_first_name, 
        p_phone,
        p_vga_number, 
        p_shirt_size, 
        p_bio, 
        IFNULL(p_profile_pic_url, 'default_avatar.png'), 
        IFNULL(p_background_color_hex, '#64748b')
    );
    
    SELECT * FROM users WHERE user_id = LAST_INSERT_ID();
END //

-- 2. Get Full Profile + Stats (READ - Required by CardProfile)
DROP PROCEDURE IF EXISTS get_user_full_profile //
CREATE PROCEDURE get_user_full_profile(
    IN p_user_id INT
)
BEGIN
    SELECT 
        u.user_id, u.email, u.first_name, u.last_name, u.phone_number, 
        u.bio, u.profile_pic_url, u.background_color_hex,
        u.vga_number, u.shirt_size,
        -- Determine Role
        CASE 
            WHEN a.admin_id IS NOT NULL THEN 'ADMIN' 
            WHEN m.member_id IS NOT NULL THEN 'MEMBER' 
            ELSE 'GUEST' 
        END as role,
        -- Calculate Stats
        (SELECT COUNT(*) FROM tournament_registrations tr WHERE tr.member_id = u.user_id) as stat_tournaments,
        (SELECT COUNT(*) FROM document_reads dr WHERE dr.member_id = u.user_id) as stat_documents_read 
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.admin_id
    LEFT JOIN members m ON u.user_id = m.member_id
    WHERE u.user_id = p_user_id;
END //

DROP PROCEDURE IF EXISTS update_user_profile //
CREATE PROCEDURE update_user_profile(
    IN p_user_id INT,
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_phone VARCHAR(20),
    IN p_vga_number VARCHAR(20),
    IN p_shirt_size VARCHAR(5),
    IN p_bio TEXT,
    IN p_profile_pic_url VARCHAR(255),
    IN p_bg_color VARCHAR(7)
)
BEGIN
    UPDATE users 
    SET 
        first_name = p_first_name,
        last_name = p_last_name,
        phone_number = p_phone,
        vga_number = p_vga_number,
        shirt_size = p_shirt_size,
        bio = p_bio,
        profile_pic_url = p_profile_pic_url,
        background_color_hex = p_bg_color
    WHERE user_id = p_user_id;

    -- Return the updated profile immediately
    CALL get_user_full_profile(p_user_id);
END //

-- 3. Get Directory Users (READ - Required by CardUser)
DROP PROCEDURE IF EXISTS get_directory_users //
CREATE PROCEDURE get_directory_users()
BEGIN
    SELECT 
        u.user_id, u.email, u.first_name, u.last_name, 
        u.phone_number, u.bio, u.profile_pic_url, u.background_color_hex,
        CASE 
            WHEN a.admin_id IS NOT NULL THEN 'ADMIN' 
            WHEN m.member_id IS NOT NULL THEN 'MEMBER' 
            ELSE 'GUEST' 
        END as role
    FROM users u
    LEFT JOIN admins a ON u.user_id = a.admin_id
    LEFT JOIN members m ON u.user_id = m.member_id
    ORDER BY u.last_name ASC;
END //

-- ----------------------------------------------------------
-- B. TOURNAMENT MANAGEMENT
-- ----------------------------------------------------------

-- 4. Create Tournament (Write)
DROP PROCEDURE IF EXISTS create_tournament //
CREATE PROCEDURE create_tournament(
    IN p_name VARCHAR(200),
    IN p_description TEXT,
    IN p_image_url VARCHAR(255),
    IN p_location VARCHAR(255),
    IN p_shotgun TIME,
    IN p_fee_member DECIMAL(15,2),
    IN p_fee_guest DECIMAL(15,2),
    IN p_bank_info TEXT,
    IN p_admin_id INT
)
BEGIN
    INSERT INTO tournaments (
        name, description, image_url, location, shotgun_time, 
        fee_member, fee_guest, bank_info, created_by, status
    ) VALUES (
        p_name, p_description, p_image_url, p_location, p_shotgun, 
        p_fee_member, p_fee_guest, p_bank_info, p_admin_id, 'UPCOMING'
    );
    SELECT * FROM tournaments WHERE tournament_id = LAST_INSERT_ID();
END //

-- 5. Get Tournaments View (READ - Required by CardTournament)
DROP PROCEDURE IF EXISTS get_tournaments_view //
CREATE PROCEDURE get_tournaments_view(
    IN p_status VARCHAR(20)
)
BEGIN
    SELECT 
        t.*, 
        CONCAT(u.first_name, ' ', u.last_name) as creator_name 
    FROM tournaments t 
    JOIN users u ON t.created_by = u.user_id
    WHERE (p_status IS NULL OR t.status = p_status)
    ORDER BY t.created_at DESC;
END //

-- ----------------------------------------------------------
-- C. REGISTRATION & PAYMENT
-- ----------------------------------------------------------

-- 6. Apply for Tournament (Write - Renamed from register_for_tournament to match Backend)
DROP PROCEDURE IF EXISTS apply_for_tournament //
CREATE PROCEDURE apply_for_tournament(
    IN p_tournament_id INT,
    IN p_user_id INT
)
BEGIN
    DECLARE v_is_member INT;
    DECLARE v_fee DECIMAL(15,2);
    DECLARE v_shirt_size VARCHAR(5);
    DECLARE v_current_players INT;
    DECLARE v_max_players INT;
    DECLARE v_tourney_status VARCHAR(20);

    -- Validation
    SELECT status, max_players INTO v_tourney_status, v_max_players 
    FROM tournaments WHERE tournament_id = p_tournament_id;

    IF v_tourney_status != 'UPCOMING' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tournament is not open.';
    END IF;

    SELECT COUNT(*) INTO v_current_players FROM tournament_registrations WHERE tournament_id = p_tournament_id;
    IF v_current_players >= v_max_players THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tournament is full.';
    END IF;

    -- Check duplicate
    IF EXISTS (SELECT 1 FROM tournament_registrations WHERE tournament_id = p_tournament_id AND member_id = p_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already registered.';
    END IF;

    -- Determine Fee
    SELECT COUNT(*) INTO v_is_member FROM members WHERE member_id = p_user_id;
    IF v_is_member > 0 THEN
        SELECT fee_member INTO v_fee FROM tournaments WHERE tournament_id = p_tournament_id;
    ELSE
        SELECT fee_guest INTO v_fee FROM tournaments WHERE tournament_id = p_tournament_id;
    END IF;

    -- Get Shirt Size
    SELECT shirt_size INTO v_shirt_size FROM users WHERE user_id = p_user_id;

    -- Insert
    INSERT INTO tournament_registrations (
        tournament_id, member_id, status, 
        payment_status, payment_amount, payment_method, registered_shirt_size
    ) VALUES (
        p_tournament_id, p_user_id, 'PENDING',
        'PENDING', v_fee, 'TRANSFER', v_shirt_size
    );
    
    SELECT * FROM tournament_registrations WHERE tournament_id = p_tournament_id AND member_id = p_user_id;
END //

-- ----------------------------------------------------------
-- D. CONTENT (DOCS & NOTIFICATIONS)
-- ----------------------------------------------------------

-- 7. Get Documents View (READ - Required by CardDocument)
DROP PROCEDURE IF EXISTS get_documents_view //
CREATE PROCEDURE get_documents_view()
BEGIN
    SELECT 
        d.*, 
        CONCAT(u.first_name, ' ', u.last_name) as author_name 
    FROM documents d 
    JOIN users u ON d.author_id = u.user_id 
    ORDER BY d.created_at DESC;
END //

-- 8. Get Notifications View (READ - Required by CardNotification)
DROP PROCEDURE IF EXISTS get_notifications_view //
CREATE PROCEDURE get_notifications_view()
BEGIN
    SELECT 
        n.*, 
        CONCAT(u.first_name, ' ', u.last_name) as author_name 
    FROM notifications n 
    JOIN users u ON n.author_id = u.user_id 
    ORDER BY n.created_at DESC;
END //

DELIMITER ;

-- ==========================================================
-- 3. TRIGGERS
-- ==========================================================

DELIMITER //
CREATE TRIGGER after_membership_approval
AFTER UPDATE ON membership_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
        INSERT IGNORE INTO members (member_id) VALUES (NEW.user_id);
    END IF;
END //
DELIMITER ;

-- ==========================================================
-- 4. DATA SEEDING
-- ==========================================================

-- Admin
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, bio, background_color_hex) 
VALUES (1, 'admin@golf.com', 'hash123', 'Alice', 'Admin', '0909123456', 'System Admin', '#ef4444');

-- Member: Nguyễn Quang Vinh
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, vga_number, shirt_size, background_color_hex) 
VALUES (2, 'vinh@test.com', 'hash123', 'Vinh', 'Nguyễn Quang', '0929093999', '990990', 'L', '#3b82f6');

-- Member: Windy Quỳnh Trần
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, vga_number, shirt_size, background_color_hex) 
VALUES (3, 'windy@test.com', 'hash123', 'Quỳnh Trần', 'Windy', '0909111222', '071054', 'XL', '#10b981');

-- Assign Roles
INSERT INTO admins (admin_id) VALUES (1);
INSERT INTO membership_requests (user_id, status, processed_by) VALUES (2, 'APPROVED', 1), (3, 'APPROVED', 1);

-- Create Tournament
INSERT INTO tournaments (
    name, description, image_url, location, shotgun_time, 
    max_players, fee_member, fee_guest, bank_info, created_by, status
) VALUES (
    'Giải Golf Doanh Nhân Sài Gòn',
    'Gây quỹ từ thiện ủng hộ đồng bào miền Trung.',
    'https://example.com/images/golf-charity-2025.jpg',
    'Sân Golf Tân Sơn Nhất', 
    '12:00:00',
    144, 3100000, 3300000, 
    'MB BANK - STK: 50607997979',
    1, 'UPCOMING'
);

SET @tourney_id = LAST_INSERT_ID();

-- Register Member for Tournament (Use new procedure name)
CALL apply_for_tournament(@tourney_id, 2);