-- ==========================================================
-- GOLF CLUB MANAGEMENT SYSTEM - TABLES
-- ==========================================================

DROP DATABASE IF EXISTS golf;
CREATE DATABASE golf CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE golf;

SET FOREIGN_KEY_CHECKS = 0;

-- 1.1 Base Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    vga_number VARCHAR(20) DEFAULT NULL,            
    shirt_size ENUM('S','M','L','XL','XXL','XXXL') DEFAULT NULL, 
    bio TEXT DEFAULT NULL,
    profile_pic_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    background_color_hex VARCHAR(7) DEFAULT '#64748b',
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

-- 1.5 Content Tables
CREATE TABLE documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT, 
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
    image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800', 
    location VARCHAR(255) NOT NULL DEFAULT 'TBD',
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    format VARCHAR(50) DEFAULT 'Stroke Play',
    max_participants INT DEFAULT 144,
    entry_fee DECIMAL(15,2) DEFAULT 0,
    status ENUM('UPCOMING', 'ONGOING', 'FINISHED', 'CANCELED') DEFAULT 'UPCOMING',
    creator_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES admins(admin_id)
);

CREATE TABLE tournament_participants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    user_id INT NOT NULL, 
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (tournament_id, user_id)
);

-- 1.7 Stats Tracking
CREATE TABLE document_reads (
    read_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    document_id INT NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(user_id),
    FOREIGN KEY (document_id) REFERENCES documents(document_id)
);

SET FOREIGN_KEY_CHECKS = 1;