-- ==========================================================
-- GOLF CLUB MANAGEMENT SYSTEM - TRIGGERS
-- ==========================================================
USE golf;
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