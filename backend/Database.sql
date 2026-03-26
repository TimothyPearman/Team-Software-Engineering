DROP DATABASE IF EXISTS CompuTaught;
CREATE DATABASE CompuTaught;
USE CompuTaught;


# ----------------------------------------------------------------------tables---------------------------------------------------------------------- #


# ---------------------------------------------------------------------- #
# Add table "Question"                                                   #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `Question`;
CREATE TABLE `Question` (
    `Question_ID` INT NOT NULL AUTO_INCREMENT,
    `Level_ID` INT NOT NULL,
    `Question` TEXT NOT NULL,
    `Answer` TEXT NOT NULL,
    CONSTRAINT `pk_Question` PRIMARY KEY (`Question_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "Dictionary"                                                 #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `Dictionary`;
CREATE TABLE `Dictionary` (
    `Dictionary_ID` INT NOT NULL AUTO_INCREMENT,
    `Description` VARCHAR(255),
    CONSTRAINT `pk_Dictionary` PRIMARY KEY (`Dictionary_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "Streak"                                                     #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `Streak`;
CREATE TABLE `Streak` (
    `Streak_ID` INT NOT NULL AUTO_INCREMENT,
    `StartDate` DATE NOT NULL,
    `EndDate` DATE,
    `Count` INT DEFAULT 0,
    CONSTRAINT `pk_Streak` PRIMARY KEY (`Streak_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "Badge"                                                      #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `Badge`;
CREATE TABLE `Badge` (
    `Badge_ID` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Description` VARCHAR(255),
    `Asset` VARCHAR(255),
    CONSTRAINT `pk_Badge` PRIMARY KEY (`Badge_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "Level"                                                      #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `Level`;
CREATE TABLE `Level` (
    `Level_ID` INT NOT NULL AUTO_INCREMENT,
    `Dictionary_ID` INT,
    CONSTRAINT `pk_Level` PRIMARY KEY (`Level_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "Progress"                                                   #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `Progress`;
CREATE TABLE `Progress` (
    `Progress_ID` INT NOT NULL AUTO_INCREMENT,
    `Score` INT DEFAULT 0,
    `Level_ID` INT,
    CONSTRAINT `pk_Progress` PRIMARY KEY (`Progress_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "USER"                                                       #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `USER`;
CREATE TABLE `User` (
    `User_ID` INT NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(100) NOT NULL UNIQUE,
    `Password_Hash` VARCHAR(255) NOT NULL,
    `CurrentStreak_ID` INT,
    `FavouriteBadge_ID` INT,
    `Progress_ID` INT,
    CONSTRAINT `pk_User` PRIMARY KEY (`User_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "User_Streaks"                                               #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `User_Streak`;
CREATE TABLE `User_Streak` (
    `User_ID` INT NOT NULL,
    `Streak_ID` INT NOT NULL,
    CONSTRAINT `pk_User_Streak` PRIMARY KEY (`User_ID`, `Streak_ID`)
);

# ---------------------------------------------------------------------- #
# Add table "User_Badges"                                                #
# ---------------------------------------------------------------------- #

DROP TABLE IF EXISTS `User_Badge`;
CREATE TABLE `User_Badge` (
    `User_ID` INT NOT NULL,
    `Badge_ID` INT NOT NULL,
    CONSTRAINT `pk_User_Badge` PRIMARY KEY (`User_ID`, `Badge_ID`)
);

# ----------------------------------------------------------------------data---------------------------------------------------------------------- #


# ---------------------------------------------------------------------- #
# Add info into all tables                                               #
# ---------------------------------------------------------------------- #

START TRANSACTION;
INSERT INTO `Streak`(StartDate,EndDate,Count)
VALUES ("1111-11-1 11:11:11", "1111-11-2 11:11:11",1);
INSERT INTO `Streak`(StartDate,EndDate,Count)
VALUES ("1111-11-4 11:11:11", "1111-11-6 11:11:11",2);

INSERT INTO `Badge`(Name,Description,Asset)
VALUES ("badge1", "badge_desc","/assets/badge1");
INSERT INTO `Badge`(Name,Description,Asset)
VALUES ("badge2", "badge_desc","/assets/badge2");

INSERT INTO `Level`(Dictionary_ID)
VALUES (1);

INSERT INTO `Dictionary`(Description)
VALUES ("dict_desc");

INSERT INTO `Question`(Level_ID,Question,Answer)
VALUES (1,"question1","answer");
INSERT INTO `Question`(Level_ID,Question,Answer)
VALUES (1,"question2","answer");
COMMIT;

START TRANSACTION;
INSERT INTO `Progress`(Score,Level_ID)
VALUES ("999", "1");
SET @ProgressID = LAST_INSERT_ID();
INSERT INTO `User`(Username,Password_Hash,CurrentStreak_ID,FavouriteBadge_ID,Progress_ID)
VALUES ("timmy", "TPass",1,1,@ProgressID);

INSERT INTO `User_Streak`(User_ID,Streak_ID)
VALUES (1,1);
INSERT INTO `User_Streak`(User_ID,Streak_ID)
VALUES (1,2);

INSERT INTO `User_Badge`(User_ID,Badge_ID)
VALUES (1,1);
INSERT INTO `User_Badge`(User_ID,Badge_ID)
VALUES (1,2);
COMMIT;

# ----------------------------------------------------------------------constraints---------------------------------------------------------------------- #


# ---------------------------------------------------------------------- #
# Foreign key constraints                                                #
# ---------------------------------------------------------------------- #

ALTER TABLE `User`
ADD CONSTRAINT `fk_User_Streak` FOREIGN KEY (`CurrentStreak_ID`)
		REFERENCES `Streak`(`Streak_ID`);
        
ALTER TABLE `User_Streak`
ADD CONSTRAINT `fk_Streaks_User` FOREIGN KEY (`User_ID`)
		REFERENCES `User`(`User_ID`);
        
ALTER TABLE `User_Streak`
ADD CONSTRAINT `fk_Streak_Streak_ID` FOREIGN KEY (`Streak_ID`)
		REFERENCES `Streak`(`Streak_ID`);
        
ALTER TABLE `User`
ADD CONSTRAINT `fk_User_Badge` FOREIGN KEY (`FavouriteBadge_ID`)
		REFERENCES `Badge`(`Badge_ID`);
        
ALTER TABLE `User_Badge`
ADD CONSTRAINT `fk_Badges_User` FOREIGN KEY (`User_ID`)
		REFERENCES `User`(`User_ID`);
        
ALTER TABLE `User_Badge`
ADD CONSTRAINT `fk_Badge_Badge_ID` FOREIGN KEY (`Badge_ID`)
		REFERENCES `Badge`(`Badge_ID`);
        
ALTER TABLE `User`
ADD CONSTRAINT `fk_User_Progress` FOREIGN KEY (`Progress_ID`)
		REFERENCES `Progress`(`Progress_ID`);
        
ALTER TABLE `Progress`
ADD CONSTRAINT `fk_Progress_Level` FOREIGN KEY (`Level_ID`)
		REFERENCES `Level`(`Level_ID`);
        
ALTER TABLE `Level`
ADD CONSTRAINT `fk_Level_Dictionary` FOREIGN KEY (`Dictionary_ID`)
		REFERENCES `Dictionary`(`Dictionary_ID`);
        
ALTER TABLE `Question`
ADD CONSTRAINT `fk_Question_Level` FOREIGN KEY (`Level_ID`)
		REFERENCES `Level`(`Level_ID`);


# ----------------------------------------------------------------------Views---------------------------------------------------------------------- #


# ---------------------------------------------------------------------- #
# Add View "Full_User"                                                   #
# ---------------------------------------------------------------------- #

CREATE OR REPLACE SQL SECURITY DEFINER VIEW `Full_User` AS
SELECT 
    `User`.User_ID,Username,`User`.Password_Hash,
    `Streak`.StartDate,`Streak`.EndDate,`Streak`.Count,
    `Badge`.Name,`Badge`.Description,`Badge`.Asset,
    `Progress`.Level_ID
FROM `User`
INNER JOIN `Streak`
	ON `User`.CurrentStreak_ID = `Streak`.Streak_ID
INNER JOIN `Badge`
	ON `User`.FavouriteBadge_ID = `Badge`.Badge_ID
INNER JOIN `Progress`
	ON `User`.Progress_ID = `Progress`.Progress_ID
ORDER BY `User`.User_ID ASC;

# ---------------------------------------------------------------------- #
# Add View "Level_Questions"                                             #
# ---------------------------------------------------------------------- #

CREATE OR REPLACE SQL SECURITY DEFINER VIEW `Level_Questions` AS
SELECT 
	`Level`.Level_ID,
    `Question`.Question_ID,`Question`.Question,`Question`.Answer
FROM `Level`
INNER JOIN `Question`
	ON `Level`.Level_ID = `Question`.Level_ID
ORDER BY `Level`.Level_ID ASC;

# ---------------------------------------------------------------------- #
# Add View "User_Streaks"                                                #
# ---------------------------------------------------------------------- #

CREATE OR REPLACE SQL SECURITY DEFINER VIEW `User_Streaks` AS
SELECT 
	`User`.User_ID,
    `Streak`.StartDate,`Streak`.EndDate,`Streak`.Count
FROM `User`
INNER JOIN `User_Streak`
	ON `User`.User_ID = `User_Streak`.User_ID
INNER JOIN `Streak`
	ON `User_Streak`.Streak_ID = `Streak`.Streak_ID
ORDER BY `User`.User_ID ASC;

# ---------------------------------------------------------------------- #
# Add View "User_Badges"                                                 #
# ---------------------------------------------------------------------- #

CREATE OR REPLACE SQL SECURITY DEFINER VIEW `User_Badges` AS
SELECT 
	`User`.User_ID,
    `Badge`.Name,`Badge`.Description,`Badge`.Asset
FROM `User`
INNER JOIN `User_Badge`
	ON `User`.User_ID = `User_Badge`.User_ID
INNER JOIN `Badge`
	ON `User_Badge`.Badge_ID = `Badge`.Badge_ID
ORDER BY `User`.User_ID ASC;


# ----------------------------------------------------------------------Debug---------------------------------------------------------------------- #


select * from `User`;
select * from `Progress`;
select * from `Level`;
select * from `Question`;
select * from `Dictionary`;
select * from `User_Streaks`;
select * from `Streak`;
select * from `User_Badges`;
select * from `Badge`;

select * from `Full_User`;
select * from `Level_Questions`;
select * from `User_Streaks`;
select * from `User_Badges`;
