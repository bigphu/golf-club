-- ----------------------------------------------------------
-- 2. TRIGGERS (DATA CORRECTNESS & LIFECYCLE)
-- ----------------------------------------------------------
DELIMITER //

-- 2.1 Sync Membership Table (Insert/Delete based on Approval)
DROP TRIGGER IF EXISTS after_membership_update //
CREATE TRIGGER after_membership_update
AFTER UPDATE ON membership_requests
FOR EACH ROW
BEGIN
    -- If status changes TO APPROVED, insert into members
    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
        INSERT IGNORE INTO members (member_id) VALUES (NEW.user_id);
    -- If status changes FROM APPROVED to anything else, remove from members
    ELSEIF OLD.status = 'APPROVED' AND NEW.status != 'APPROVED' THEN
        DELETE FROM members WHERE member_id = NEW.user_id;
    END IF;
END //

-- 2.2 Tournament Date Validation & Rescheduling Logic
DROP TRIGGER IF EXISTS before_tournament_validation //
CREATE TRIGGER before_tournament_validation
BEFORE UPDATE ON tournaments
FOR EACH ROW
BEGIN
    -- Ensure logical date sequence
    IF NEW.start_date >= NEW.end_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'End date must be after start date.';
    END IF;

    -- Automatically update status if dates are rescheduled
    IF OLD.start_date <> NEW.start_date OR OLD.end_date <> NEW.end_date THEN
        IF NEW.start_date > NOW() THEN
            SET NEW.status = 'UPCOMING';
        ELSEIF NOW() BETWEEN NEW.start_date AND NEW.end_date THEN
            SET NEW.status = 'ONGOING';
        ELSEIF NEW.end_date < NOW() THEN
            SET NEW.status = 'FINISHED';
        END IF;
    END IF;
END //

-- 2.3 Participant Capacity Guard
DROP TRIGGER IF EXISTS before_participant_join //
CREATE TRIGGER before_participant_join
BEFORE INSERT ON tournament_participants
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    DECLARE v_max INT;

    SELECT COUNT(*), (SELECT max_participants FROM tournaments WHERE tournament_id = NEW.tournament_id)
    INTO v_count, v_max
    FROM tournament_participants
    WHERE tournament_id = NEW.tournament_id AND status = 'APPROVED';

    IF v_count >= v_max AND NEW.status = 'APPROVED' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tournament is at maximum capacity.';
    END IF;
END //

DROP TRIGGER IF EXISTS before_tournament_insert_status //
CREATE TRIGGER before_tournament_insert_status
BEFORE INSERT ON tournaments
FOR EACH ROW
BEGIN
    -- 1. Date Logic Validation
    IF NEW.start_date >= NEW.end_date THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Tournament end_date must be after start_date.';
    END IF;

    -- 2. Automatic Status Calculation
    IF NOW() < NEW.start_date THEN
        SET NEW.status = 'UPCOMING';
    ELSEIF NOW() BETWEEN NEW.start_date AND NEW.end_date THEN
        SET NEW.status = 'ONGOING';
    ELSEIF NOW() > NEW.end_date THEN
        SET NEW.status = 'FINISHED';
    END IF;
END //

DELIMITER ;

-- ----------------------------------------------------------
-- 3. AUTOMATION (EVENT SCHEDULER)
-- ----------------------------------------------------------
SET GLOBAL event_scheduler = ON;

DELIMITER //

CREATE EVENT IF NOT EXISTS update_tournament_statuses_daily
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Move Upcoming to Ongoing if start_date has arrived
    UPDATE tournaments SET status = 'ONGOING' 
    WHERE status = 'UPCOMING' AND NOW() >= start_date AND NOW() <= end_date;

    -- Move Ongoing to Finished if end_date has passed
    UPDATE tournaments SET status = 'FINISHED' 
    WHERE status IN ('UPCOMING', 'ONGOING') AND NOW() > end_date;
END //

DELIMITER ;