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
    `Description` VARCHAR(1000),
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

START TRANSACTION;

# ---------------------------------------------------------------------- #
# Insert badges                                        				     #
# ---------------------------------------------------------------------- #

INSERT INTO `Badge`(Name,Description)
VALUES ("welcome", "create an account");
INSERT INTO `Badge`(Name,Description)
VALUES ("first steps", "complete the first level");

# ---------------------------------------------------------------------- #
# Insert dictionary entries (Levels 1 to 5)                              #
# ---------------------------------------------------------------------- #

INSERT INTO `Dictionary`(Description)
VALUES ("1) SQL is the standard language for managing, manipulating and retrieving data stored in relational databases. \n
		 2) motherboard is the main printed circuit board, holding and allowing communication between many of the crucial electronic components of a system. \n
		 3) RAM is a form of electronic computer memory that can be read and changed in any order, typically used to store working data and machine code. \n
		 4) string s=“ABC”; /ncout << s[1]; would result in the output “B” as C++ used 0-based indexing, meaning A would be 0, B would be 1, and C would be 2. Therefore outputting 1, resulting in B. \n
		 5) Computer architecture is the design, structure and functional organisation of a computer system, determining how components such as the CPU, memory, or I/O devices interact with eachothern.");
INSERT INTO `Dictionary`(Description)
VALUES ("1) Science would be the output, as print(test[8:]) means to print the given text after the 8th character, which would start at S for science. \n
		 2) M in ram is memory, as RAM stands for random access memory. \n
		 3) 2myvar, as variables cannot begin with numbers. \n
		 4) .py stands for a python file, example = main.py. \n
		 5) string data type stores text.\n
		 6) * is used to multiply numbers, using, as symbols are used for mathematical functions (eg % for divide.)");
INSERT INTO `Dictionary`(Description)
VALUES ("1) HTTPS is used for a secure communication over a computer network, standing for hypertext transfer protocol secure. \n
		 2) Bubble sort is a simple iterative sorting algorithm that works by repeatedly stepping through a list, comparing adjacent elements, and swapping them if they are in the wrong order. \n
		 3) HTML stands for hyper text markup language, providing a means to create structured documents. \n
		 4) C# as an OOP language has straightforward, clearly defined keywords, whereas C does not. \n
		 5) managing hardware and software resources, as an operating system acts as a bridge between the user and the computer hardware to provide an environment where users can execute program’s efficiently. \n
		 6) Stack data structure is a linear data structure that follows the LIFO principle, meaning the last element added to the stack is the first one to be removed.");
INSERT INTO `Dictionary`(Description)
VALUES ("1) Linear complexity - algorithm time complexity is given by 0(n). \n
		 2) 0(log n) - the time complexity of binary search. \n
		 3) Singleton - the design pattern that restricts the instantation of a class to one “single” instance. \n
		 4) Big (0), Big (Ω), Big (θ), all describe the time complexity of an algorithm. \n
		 5) The code: \n
			i = 0 \n
			while (i <= 5): \n
				print (‘‘Hello’’) \n
				i = i - 1  \n
			would print the message Hello, an infinite number of times, as i will always be less than 5.");
INSERT INTO `Dictionary`(Description)
VALUES ("1) 0(n2) is the big 0 complexity of the loop: for (int i = 0; i < n; i++) \n
		 2) The python code: 
			x = “123”  \n
			y = int(x[0]) + int(x[2])  \n
			print(y) \n
			will have the output 4, as x[0] is the first item in the list ‘1’, added to the third item in the list ‘3’ which results in the outcome 4. \n
		 3) The C++ code:  \n
			int x = 10;  \n
			int *p = &x;  \n
			p += 5;  \n
			cout << x;  \n
			would result in the output 15, as its addingp and x together, as *p = &x  \n
		 4) If you try to reference a null pointer in C++, it causes a segmentation fault, which is undefined behaviour.  \n
		 5) Node.js uses the concurrency model Event-driven, non-blocking I/O  \n
		 6) A deadlock in operating systems is when two or more processes are waiting indefinitely for an event that can be caused by only one of the waiting processes.");

# ---------------------------------------------------------------------- #
# Insert Levels 1, 2, 3, 4, 5                                            #
# ---------------------------------------------------------------------- #

INSERT INTO `Level`(Dictionary_ID) VALUES (1); -- Level 1
INSERT INTO `Level`(Dictionary_ID) VALUES (2); -- Level 2
INSERT INTO `Level`(Dictionary_ID) VALUES (3); -- Level 3
INSERT INTO `Level`(Dictionary_ID) VALUES (4); -- Level 4
INSERT INTO `Level`(Dictionary_ID) VALUES (5); -- Level 5

# ---------------------------------------------------------------------- #
# Insert Questions (Levels 1 to 5)                                       #
# ---------------------------------------------------------------------- #

-- Level 1 (Beginner)
INSERT INTO `Question`(Level_ID, Question, Answer) VALUES 
(1, 'What does SQL stand for?\nA) Simple Query Language\nB) Structured Query Language\nC) Sequential Query Link\nD) Standard Question List', 'B'),
(1, 'What is the main circuit board called that holds the CPU?\nA) Power Supply\nB) Motherboard\nC) Hard Drive\nD) Graphics Card', 'B'),
(1, 'Which type of memory is "volatile" (loses data when power is off)?\nA) ROM\nB) SSD\nC) RAM\nD) Flash', 'C'),
(1, 'Which of these is the correct way to add an item to the end of a list called my_list?\nA) my_list.add("item")\nB) my_list.append("item")\nC) my_list.insert("item")\nD) my_list.push("item")', 'B'),
(1, 'What is the output of this C++ code?\nstring s="ABC";\ncout << s[1];\nA) A\nB) B\nC) C\nD) ABC', 'B'),
(1, 'The set of rules and methods that describe the functionality, organization, and implementation of computer systems is known as:\nA) Computer Organization\nB) Computer Architecture\nC) Computer Design\nD) Networking', 'B');

-- Level 2 (Easy)
INSERT INTO `Question`(Level_ID, Question, Answer) VALUES 
(2, 'What is the output of this Python slice?\ntext = "ComputerScience"\nprint(text[8:])\nA) Computer\nB) Science\nC) ience\nD) ComputerS', 'B'),
(2, 'What does the M stand for in RAM?\nA) Module\nB) Mainframe\nC) Macro\nD) Memory', 'D'),
(2, 'Which of the following is not a valid variable name in Python?\nA) my_var\nB) _myvar\nC) 2myvar\nD) myVar2', 'C'),
(2, 'What is the correct file extension for Python files?\nA) .pyth\nB) .pt\nC) .py\nD) .pyt', 'C'),
(2, 'In C++, which data type is used to create a variable that should store text?\nA) string\nB) txt\nC) String\nD) myString', 'A'),
(2, 'Which operator is used to multiply numbers in Python?\nA) x\nB) %\nC) *\nD) #', 'C');

-- Level 3 (Medium)
INSERT INTO `Question`(Level_ID, Question, Answer) VALUES 
(3, 'In networking, which protocol is primarily used to secure communication over a computer network?\nA) HTTP\nB) HTTPS\nC) FTP\nD) SMTP', 'B'),
(3, 'Which sorting algorithm works by repeatedly swapping adjacent elements?\nA) Quick Sort\nB) Merge Sort\nC) Bubble Sort\nD) Insertion Sort', 'C'),
(3, 'What does HTML stand for?\nA) Hyper Text Markup Language\nB) Home Tool Markup Language\nC) Hyperlinks and Text Markup Language\nD) Hyper Tool Markup Language', 'A'),
(3, 'Which is not an object-oriented programming language?\nA) Java\nB) C++\nC) C\nD) Python', 'C'),
(3, 'What is the primary function of an operating system?\nA) To play games\nB) To manage hardware and software resources\nC) To compile code\nD) To browse the internet', 'B'),
(3, 'Which data structure uses LIFO (Last In First Out)?\nA) Queue\nB) Stack\nC) Tree\nD) Graph', 'B');

-- Level 4 (Hard)
INSERT INTO `Question`(Level_ID, Question, Answer) VALUES 
(4, 'If for an algorithm time complexity is given by O(n) then complexity of it is:\nA) constant\nB) linear\nC) exponential\nD) none of the mentioned', 'B'),
(4, 'What is the time complexity of binary search?\nA) O(n)\nB) O(n log n)\nC) O(log n)\nD) O(1)', 'C'),
(4, 'Which design pattern restricts the instantiation of a class to one "single" instance?\nA) Factory\nB) Observer\nC) Singleton\nD) Decorator', 'C'),
(4, 'In SQL, what is the default sort order of the ORDER BY keyword?\nA) Descending\nB) Ascending\nC) Random\nD) Depends on the database', 'B'),
(4, 'Which of the following describes the time complexity of an algorithm?\nA) Big (O)\nB) Big (Ω)\nC) Big (θ)\nD) All of the above', 'D'),
(4, 'How many times the message: "Hello" will be printed if we run the following block of code:\ni = 0\nwhile (i <= 5):\n    print (''Hello'')\n    i = i - 1\nA) None\nB) 1\nC) 5\nD) Infinite', 'D');

-- Level 5 (Expert)
INSERT INTO `Question`(Level_ID, Question, Answer) VALUES 
(5, 'What is the Big O complexity of the following loop?\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j < n; j++) {\n        // simple operation\n    }\n}\nA) O(n)\nB) O(log n)\nC) O(n²)\nD) O(1)', 'C'),
(5, 'What is the output of this Python code?\nx = "123"\ny = int(x[0]) + int(x[2])\nprint(y)\nA) 4\nB) 13\nC) 6\nD) 123', 'A'),
(5, 'What is the output of this C++ code involving pointers?\nint x = 10;\nint *p = &x;\n*p += 5;\ncout << x;\nA) 10\nB) 5\nC) 15\nD) Error', 'C'),
(5, 'What happens if you try to dereference a null pointer in C++?\nA) It returns 0\nB) It throws a compiler error\nC) It causes a segmentation fault (undefined behavior)\nD) It returns -1', 'C'),
(5, 'Which concurrency model does Node.js primarily use?\nA) Multi-threading\nB) Event-driven, non-blocking I/O\nC) Actor model\nD) Coroutines', 'B'),
(5, 'What is a deadlock in operating systems?\nA) When a thread finishes execution\nB) When two or more processes are waiting indefinitely for an event that can be caused by only one of the waiting processes\nC) When a process is suspended\nD) When memory is fully utilized', 'B');

COMMIT;

# ---------------------------------------------------------------------- #
# Add test account info into all tables                                  #
# ---------------------------------------------------------------------- #

START TRANSACTION;

INSERT INTO `Progress`(Score,Level_ID)
VALUES ("999", "1");
SET @ProgressID = LAST_INSERT_ID();
INSERT INTO `User`(Username,Password_Hash,CurrentStreak_ID,FavouriteBadge_ID,Progress_ID)
VALUES ("timmy", "$2b$12$6POCB3hmuJW227fJOcr0B.YQIXfeZgIrLnBtexe.ORff5O8ZcfyAu",1,1,@ProgressID);

INSERT INTO `Streak`(StartDate,EndDate,Count)
VALUES ("1111-11-1 11:11:11", "1111-11-2 11:11:11",1);
INSERT INTO `Streak`(StartDate,EndDate,Count)
VALUES ("1111-11-4 11:11:11", "1111-11-6 11:11:11",2);

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
    `Badge`.Badge_ID,`Badge`.Name,`Badge`.Description,
    `Progress`.Level_ID,`Progress`.Score
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
    `Badge`.Badge_ID,
    `Badge`.Name,`Badge`.Description
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

select * from `Dictionary`;
