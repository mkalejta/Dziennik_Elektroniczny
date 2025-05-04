-- Tworzenie tabeli Class
CREATE TABLE IF NOT EXISTS class (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Tworzenie tabeli Subjects
CREATE TABLE IF NOT EXISTS subjects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES class(id)
);

-- Tworzenie tabeli Grades
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    grade FLOAT NOT NULL,
    subject_id VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(255) NOT NULL
);

-- Tworzenie tabeli Timetable
CREATE TABLE IF NOT EXISTS timetable (
    id SERIAL PRIMARY KEY,
    class_id VARCHAR(255) NOT NULL,
    subject_id VARCHAR(255) NOT NULL,
    teacher_id VARCHAR(255) NOT NULL,
    day VARCHAR(255) NOT NULL,
    start_at TIME NOT NULL,
    finish_at TIME NOT NULL
);

-- Tworzenie tabeli Students Classes
CREATE TABLE IF NOT EXISTS students_classes (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    class_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES class(id)
);

-- Dodanie klas
INSERT INTO class (id, name) VALUES
('1A', 'Class 1A'),
('1B', 'Class 1B'),
('1C', 'Class 1C'),
('2A', 'Class 2A'),
('2B', 'Class 2B'),
('3A', 'Class 3A'),
('4A', 'Class 4A'),
('4B', 'Class 4B');

-- Dodanie przedmiotów i przypisanie nauczycieli
INSERT INTO subjects (id, name, class_id, teacher_id) VALUES
('math', 'Mathematics', '1A', 'teacher1'),
('physics', 'Physics', '1B', 'teacher2'),
('chemistry', 'Chemistry', '1C', 'teacher3'),
('biology', 'Biology', '2A', 'teacher4'),
('history', 'History', '2B', 'teacher5'),
('geography', 'Geography', '3A', 'teacher6'),
('english', 'English', '4A', 'teacher7'),
('polish', 'Polish', '4B', 'teacher8'),
('it', 'Information Technology', '1A', 'teacher9'),
('pe', 'Physical Education', '1B', 'teacher10');

-- Dodanie relacji studentów do klas
INSERT INTO students_classes (student_id, class_id) VALUES
('student1', '1A'),
('student2', '1B'),
('student3', '1C'),
('student4', '2A'),
('student5', '2B'),
('student6', '3A'),
('student7', '4A'),
('student8', '4B'),
('student9', '1A'),
('student10', '1B'),
('student11', '1C'),
('student12', '2A'),
('student13', '2B'),
('student14', '3A'),
('student15', '4A'),
('student16', '4B'),
('student17', '1A'),
('student18', '1B'),
('student19', '1C'),
('student20', '2A'),
('student21', '2B'),
('student22', '3A'),
('student23', '4A'),
('student24', '4B'),
('student25', '1A'),
('student26', '1B'),
('student27', '1C'),
('student28', '2A'),
('student29', '2B'),
('student30', '3A'),
('student31', '4A'),
('student32', '4B'),
('student33', '1A'),
('student34', '1B'),
('student35', '1C'),
('student36', '2A'),
('student37', '2B'),
('student38', '3A'),
('student39', '4A'),
('student40', '4B');

-- Dodanie ocen
INSERT INTO grades (student_id, grade, subject_id, teacher_id) VALUES
('student1', 4.5, 'math', 'teacher1'),
('student2', 3.0, 'math', 'teacher1'),
('student3', 5.0, 'physics', 'teacher2'),
('student4', 2.5, 'physics', 'teacher2');
