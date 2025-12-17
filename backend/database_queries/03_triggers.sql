-- 03_triggers.sql
USE golf;

DROP TRIGGER IF EXISTS after_membership_approval;
DROP TRIGGER IF EXISTS before_tournament_registration;

DELIMITER //

-- 1. Automate Role Assignment
-- When a request is set to APPROVED, copy the user to the 'members' table
CREATE TRIGGER after_membership_approval
AFTER UPDATE ON membership_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
        INSERT IGNORE INTO members (member_id) VALUES (NEW.user_id);
    END IF;
END //

-- 2. Enforce Business Logic
-- Prevent registration if tournament is not UPCOMING
CREATE TRIGGER before_tournament_registration
BEFORE INSERT ON tournament_registrations
FOR EACH ROW
BEGIN
    DECLARE current_status VARCHAR(20);
    
    SELECT status INTO current_status 
    FROM tournaments 
    WHERE tournament_id = NEW.tournament_id;
    
    IF current_status != 'UPCOMING' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Cannot register. Tournament is not in UPCOMING state.';
    END IF;
END //

-- 3. Prevent Score Updates for Non-Approved Players
CREATE TRIGGER before_score_update
BEFORE UPDATE ON tournament_registrations
FOR EACH ROW
BEGIN
    -- If the score is changing, but the status is NOT Approved
    IF NEW.score IS NOT NULL AND OLD.status != 'APPROVED' AND NEW.status != 'APPROVED' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Cannot assign score to a player who is not APPROVED.';
    END IF;
END //

DELIMITER ;