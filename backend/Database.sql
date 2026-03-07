DROP DATABASE IF EXISTS GamificationApp;
CREATE DATABASE GamificationApp;
USE GamificationApp;


CREATE TABLE `Badge` (
    `Badge_ID` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Description` VARCHAR(255),
    `Asset` VARCHAR(255) COMMENT 'File path for the badge image',
    `UnlockLevel` INT COMMENT 'From text spec: level required to unlock',
    CONSTRAINT `pk_Badge` PRIMARY KEY (`Badge_ID`)
);

CREATE TABLE `Streak` (
    `Streak_ID` INT NOT NULL AUTO_INCREMENT,
    `StartDate` DATE NOT NULL,
    `EndDate` DATE,
    `Count` INT DEFAULT 0,
    CONSTRAINT `pk_Streak` PRIMARY KEY (`Streak_ID`)
);

CREATE TABLE `Dictionary` (
    `Dictionary_ID` INT NOT NULL AUTO_INCREMENT,
    `Topic` VARCHAR(100) NOT NULL,
    `Description` VARCHAR(255),
    CONSTRAINT `pk_Dictionary` PRIMARY KEY (`Dictionary_ID`)
);

CREATE TABLE `Question` (
    `Question_ID` INT NOT NULL AUTO_INCREMENT,
    `Question` TEXT NOT NULL,
    `Answer` TEXT NOT NULL,
    CONSTRAINT `pk_Question` PRIMARY KEY (`Question_ID`)
);


CREATE TABLE `Level` (
    `Level_ID` INT NOT NULL AUTO_INCREMENT,
    `Dictionary_ID` INT,
    `QuestionOne` INT COMMENT 'FK from text spec',
    `QuestionTwo` INT COMMENT 'FK from text spec',
    `QuestionThree` INT COMMENT 'FK from text spec',
    `QuestionFour` INT COMMENT 'FK from text spec',
    `QuestionFive` INT COMMENT 'FK from text spec',
    CONSTRAINT `pk_Level` PRIMARY KEY (`Level_ID`),
    CONSTRAINT `fk_Level_Dictionary` FOREIGN KEY (`Dictionary_ID`) REFERENCES `Dictionary`(`Dictionary_ID`),
    CONSTRAINT `fk_Level_Q1` FOREIGN KEY (`QuestionOne`) REFERENCES `Question`(`Question_ID`),
    CONSTRAINT `fk_Level_Q2` FOREIGN KEY (`QuestionTwo`) REFERENCES `Question`(`Question_ID`),
    CONSTRAINT `fk_Level_Q3` FOREIGN KEY (`QuestionThree`) REFERENCES `Question`(`Question_ID`),
    CONSTRAINT `fk_Level_Q4` FOREIGN KEY (`QuestionFour`) REFERENCES `Question`(`Question_ID`),
    CONSTRAINT `fk_Level_Q5` FOREIGN KEY (`QuestionFive`) REFERENCES `Question`(`Question_ID`)
);

CREATE TABLE `Progress` (
    `Progress_ID` INT NOT NULL AUTO_INCREMENT,
    `Score` INT DEFAULT 0,
    `Level_ID` INT,
    CONSTRAINT `pk_Progress` PRIMARY KEY (`Progress_ID`),
    CONSTRAINT `fk_Progress_Level` FOREIGN KEY (`Level_ID`) REFERENCES `Level`(`Level_ID`)
);

CREATE TABLE `User` (
    `User_ID` INT NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(100) NOT NULL UNIQUE,
    `Password_Hash` VARCHAR(255) NOT NULL,
    `CurrentStreak_ID` INT,
    `FavouriteBadge_ID` INT,
    `Progress_ID` INT,
    CONSTRAINT `pk_User` PRIMARY KEY (`User_ID`),
    CONSTRAINT `fk_User_Streak` FOREIGN KEY (`CurrentStreak_ID`) REFERENCES `Streak`(`Streak_ID`),
    CONSTRAINT `fk_User_Badge` FOREIGN KEY (`FavouriteBadge_ID`) REFERENCES `Badge`(`Badge_ID`),
    CONSTRAINT `fk_User_Progress` FOREIGN KEY (`Progress_ID`) REFERENCES `Progress`(`Progress_ID`)
);

CREATE TABLE `User_Streaks` (
    `User_ID` INT NOT NULL,
    `Streak_ID` INT NOT NULL,
    CONSTRAINT `pk_User_Streaks` PRIMARY KEY (`User_ID`, `Streak_ID`),
    CONSTRAINT `fk_UserStreaks_User` FOREIGN KEY (`User_ID`) REFERENCES `User`(`User_ID`) ON DELETE CASCADE,
    CONSTRAINT `fk_UserStreaks_Streak` FOREIGN KEY (`Streak_ID`) REFERENCES `Streak`(`Streak_ID`) ON DELETE CASCADE
);

CREATE TABLE `User_Badges` (
    `User_ID` INT NOT NULL,
    `Badge_ID` INT NOT NULL,
    CONSTRAINT `pk_User_Badges` PRIMARY KEY (`User_ID`, `Badge_ID`),
    CONSTRAINT `fk_UserBadges_User` FOREIGN KEY (`User_ID`) REFERENCES `User`(`User_ID`) ON DELETE CASCADE,
    CONSTRAINT `fk_UserBadges_Badge` FOREIGN KEY (`Badge_ID`) REFERENCES `Badge`(`Badge_ID`) ON DELETE CASCADE
);
