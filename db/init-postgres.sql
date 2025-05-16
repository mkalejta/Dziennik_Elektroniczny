-- Tworzenie tabeli Class
CREATE TABLE IF NOT EXISTS class (
    id VARCHAR(255) PRIMARY KEY
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
INSERT INTO class (id) VALUES
('1A'),
('1B'),
('1C'),
('1D'),
('2A'),
('2B'),
('2C'),
('2D'),
('3A'),
('3B'),
('3C'),
('3D'),
('4A'),
('4B'),
('4C'),
('4D');

-- Dodanie przedmiotów i przypisanie nauczycieli
INSERT INTO subjects (id, name, class_id, teacher_id) VALUES
-- Matematyka
('mat1A', 'Matematyka', '1A', 'teacher1'),
('mat1B', 'Matematyka', '1B', 'teacher1'),
('mat1C', 'Matematyka', '1C', 'teacher1'),
('mat1D', 'Matematyka', '1D', 'teacher1'),
('mat2A', 'Matematyka', '2A', 'teacher1'),
('mat2B', 'Matematyka', '2B', 'teacher1'),
('mat2C', 'Matematyka', '2C', 'teacher1'),
('mat2D', 'Matematyka', '2D', 'teacher1'),
('mat3A', 'Matematyka', '3A', 'teacher2'),
('mat3B', 'Matematyka', '3B', 'teacher2'),
('mat3C', 'Matematyka', '3C', 'teacher2'),
('mat3D', 'Matematyka', '3D', 'teacher2'),
('mat4A', 'Matematyka', '4A', 'teacher2'),
('mat4B', 'Matematyka', '4B', 'teacher2'),
('mat4C', 'Matematyka', '4C', 'teacher2'),
('mat4D', 'Matematyka', '4D', 'teacher2'),

-- Fizyka
('fiz1A', 'Fizyka', '1A', 'teacher3'),
('fiz1B', 'Fizyka', '1B', 'teacher3'),
('fiz1C', 'Fizyka', '1C', 'teacher3'),
('fiz1D', 'Fizyka', '1D', 'teacher3'),
('fiz2A', 'Fizyka', '2A', 'teacher3'),
('fiz2B', 'Fizyka', '2B', 'teacher3'),
('fiz2C', 'Fizyka', '2C', 'teacher3'),
('fiz2D', 'Fizyka', '2D', 'teacher3'),
('fiz3A', 'Fizyka', '3A', 'teacher4'),
('fiz3B', 'Fizyka', '3B', 'teacher4'),
('fiz3C', 'Fizyka', '3C', 'teacher4'),
('fiz3D', 'Fizyka', '3D', 'teacher4'),
('fiz4A', 'Fizyka', '4A', 'teacher4'),
('fiz4B', 'Fizyka', '4B', 'teacher4'),
('fiz4C', 'Fizyka', '4C', 'teacher4'),
('fiz4D', 'Fizyka', '4D', 'teacher4'),

-- Chemia
('chem1A', 'Chemia', '1A', 'teacher5'),
('chem1B', 'Chemia', '1B', 'teacher5'),
('chem1C', 'Chemia', '1C', 'teacher5'),
('chem1D', 'Chemia', '1D', 'teacher5'),
('chem2A', 'Chemia', '2A', 'teacher5'),
('chem2B', 'Chemia', '2B', 'teacher5'),
('chem2C', 'Chemia', '2C', 'teacher5'),
('chem2D', 'Chemia', '2D', 'teacher5'),
('chem3A', 'Chemia', '3A', 'teacher6'),
('chem3B', 'Chemia', '3B', 'teacher6'),
('chem3C', 'Chemia', '3C', 'teacher6'),
('chem3D', 'Chemia', '3D', 'teacher6'),
('chem4A', 'Chemia', '4A', 'teacher6'),
('chem4B', 'Chemia', '4B', 'teacher6'),
('chem4C', 'Chemia', '4C', 'teacher6'),
('chem4D', 'Chemia', '4D', 'teacher6'),

-- Biologia
('bio1A', 'Biologia', '1A', 'teacher7'),
('bio1B', 'Biologia', '1B', 'teacher7'),
('bio1C', 'Biologia', '1C', 'teacher7'),
('bio1D', 'Biologia', '1D', 'teacher7'),
('bio2A', 'Biologia', '2A', 'teacher7'),
('bio2B', 'Biologia', '2B', 'teacher7'),
('bio2C', 'Biologia', '2C', 'teacher7'),
('bio2D', 'Biologia', '2D', 'teacher7'),
('bio3A', 'Biologia', '3A', 'teacher8'),
('bio3B', 'Biologia', '3B', 'teacher8'),
('bio3C', 'Biologia', '3C', 'teacher8'),
('bio3D', 'Biologia', '3D', 'teacher8'),
('bio4A', 'Biologia', '4A', 'teacher8'),
('bio4B', 'Biologia', '4B', 'teacher8'),
('bio4C', 'Biologia', '4C', 'teacher8'),
('bio4D', 'Biologia', '4D', 'teacher8'),

-- Historia
('hist1A', 'Historia', '1A', 'teacher9'),
('hist1B', 'Historia', '1B', 'teacher9'),
('hist1C', 'Historia', '1C', 'teacher9'),
('hist1D', 'Historia', '1D', 'teacher9'),
('hist2A', 'Historia', '2A', 'teacher9'),
('hist2B', 'Historia', '2B', 'teacher9'),
('hist2C', 'Historia', '2C', 'teacher9'),
('hist2D', 'Historia', '2D', 'teacher9'),
('hist3A', 'Historia', '3A', 'teacher10'),
('hist3B', 'Historia', '3B', 'teacher10'),
('hist3C', 'Historia', '3C', 'teacher10'),
('hist3D', 'Historia', '3D', 'teacher10'),
('hist4A', 'Historia', '4A', 'teacher10'),
('hist4B', 'Historia', '4B', 'teacher10'),
('hist4C', 'Historia', '4C', 'teacher10'),
('hist4D', 'Historia', '4D', 'teacher10'),

-- Polski
('pol1A', 'Polski', '1A', 'teacher11'),
('pol1B', 'Polski', '1B', 'teacher11'),
('pol1C', 'Polski', '1C', 'teacher11'),
('pol1D', 'Polski', '1D', 'teacher11'),
('pol2A', 'Polski', '2A', 'teacher11'),
('pol2B', 'Polski', '2B', 'teacher11'),
('pol2C', 'Polski', '2C', 'teacher11'),
('pol2D', 'Polski', '2D', 'teacher11'),
('pol3A', 'Polski', '3A', 'teacher12'),
('pol3B', 'Polski', '3B', 'teacher12'),
('pol3C', 'Polski', '3C', 'teacher12'),
('pol3D', 'Polski', '3D', 'teacher12'),
('pol4A', 'Polski', '4A', 'teacher12'),
('pol4B', 'Polski', '4B', 'teacher12'),
('pol4C', 'Polski', '4C', 'teacher12'),
('pol4D', 'Polski', '4D', 'teacher12'),

-- Angielski
('ang1A', 'Angielski', '1A', 'teacher13'),
('ang1B', 'Angielski', '1B', 'teacher13'),
('ang1C', 'Angielski', '1C', 'teacher13'),
('ang1D', 'Angielski', '1D', 'teacher13'),
('ang2A', 'Angielski', '2A', 'teacher13'),
('ang2B', 'Angielski', '2B', 'teacher13'),
('ang2C', 'Angielski', '2C', 'teacher13'),
('ang2D', 'Angielski', '2D', 'teacher13'),
('ang3A', 'Angielski', '3A', 'teacher14'),
('ang3B', 'Angielski', '3B', 'teacher14'),
('ang3C', 'Angielski', '3C', 'teacher14'),
('ang3D', 'Angielski', '3D', 'teacher14'),
('ang4A', 'Angielski', '4A', 'teacher14'),
('ang4B', 'Angielski', '4B', 'teacher14'),
('ang4C', 'Angielski', '4C', 'teacher14'),
('ang4D', 'Angielski', '4D', 'teacher14'),

-- WF
('wf1A', 'WF', '1A', 'teacher15'),
('wf1B', 'WF', '1B', 'teacher15'),
('wf1C', 'WF', '1C', 'teacher15'),
('wf1D', 'WF', '1D', 'teacher15'),
('wf2A', 'WF', '2A', 'teacher15'),
('wf2B', 'WF', '2B', 'teacher15'),
('wf2C', 'WF', '2C', 'teacher15'),
('wf2D', 'WF', '2D', 'teacher15'),
('wf3A', 'WF', '3A', 'teacher16'),
('wf3B', 'WF', '3B', 'teacher16'),
('wf3C', 'WF', '3C', 'teacher16'),
('wf3D', 'WF', '3D', 'teacher16'),
('wf4A', 'WF', '4A', 'teacher16'),
('wf4B', 'WF', '4B', 'teacher16'),
('wf4C', 'WF', '4C', 'teacher16'),
('wf4D', 'WF', '4D', 'teacher16'),

-- Informatyka
('inf1A', 'Informatyka', '1A', 'teacher17'),
('inf1B', 'Informatyka', '1B', 'teacher17'),
('inf1C', 'Informatyka', '1C', 'teacher17'),
('inf1D', 'Informatyka', '1D', 'teacher17'),
('inf2A', 'Informatyka', '2A', 'teacher17'),
('inf2B', 'Informatyka', '2B', 'teacher17'),
('inf2C', 'Informatyka', '2C', 'teacher17'),
('inf2D', 'Informatyka', '2D', 'teacher17'),
('inf3A', 'Informatyka', '3A', 'teacher18'),
('inf3B', 'Informatyka', '3B', 'teacher18'),
('inf3C', 'Informatyka', '3C', 'teacher18'),
('inf3D', 'Informatyka', '3D', 'teacher18'),
('inf4A', 'Informatyka', '4A', 'teacher18'),
('inf4B', 'Informatyka', '4B', 'teacher18'),
('inf4C', 'Informatyka', '4C', 'teacher18'),
('inf4D', 'Informatyka', '4D', 'teacher18'),

-- Geografia
('geo1A', 'Geografia', '1A', 'teacher19'),
('geo1B', 'Geografia', '1B', 'teacher19'),
('geo1C', 'Geografia', '1C', 'teacher19'),
('geo1D', 'Geografia', '1D', 'teacher19'),
('geo2A', 'Geografia', '2A', 'teacher19'),
('geo2B', 'Geografia', '2B', 'teacher19'),
('geo2C', 'Geografia', '2C', 'teacher19'),
('geo2D', 'Geografia', '2D', 'teacher19'),
('geo3A', 'Geografia', '3A', 'teacher20'),
('geo3B', 'Geografia', '3B', 'teacher20'),
('geo3C', 'Geografia', '3C', 'teacher20'),
('geo3D', 'Geografia', '3D', 'teacher20'),
('geo4A', 'Geografia', '4A', 'teacher20'),
('geo4B', 'Geografia', '4B', 'teacher20'),
('geo4C', 'Geografia', '4C', 'teacher20'),
('geo4D', 'Geografia', '4D', 'teacher20');

-- Przykładowy plan lekcji (timetable)
INSERT INTO timetable (class_id, subject_id, teacher_id, day, start_at, finish_at) VALUES
-- 1A
('1A', 'mat1A', 'teacher1', 'Poniedziałek', '08:00', '08:45'),
('1A', 'fiz1A', 'teacher3', 'Wtorek', '09:00', '09:45'),
('1A', 'chem1A', 'teacher5', 'Środa', '10:00', '10:45'),
('1A', 'bio1A', 'teacher7', 'Czwartek', '11:00', '11:45'),
('1A', 'hist1A', 'teacher9', 'Piątek', '12:00', '12:45'),

-- 1B
('1B', 'mat1B', 'teacher1', 'Poniedziałek', '09:00', '09:45'),
('1B', 'fiz1B', 'teacher3', 'Wtorek', '10:00', '10:45'),
('1B', 'chem1B', 'teacher5', 'Środa', '11:00', '11:45'),
('1B', 'bio1B', 'teacher7', 'Czwartek', '12:00', '12:45'),
('1B', 'hist1B', 'teacher9', 'Piątek', '13:00', '13:45'),

-- 1C
('1C', 'mat1C', 'teacher1', 'Poniedziałek', '10:00', '10:45'),
('1C', 'fiz1C', 'teacher3', 'Wtorek', '11:00', '11:45'),
('1C', 'chem1C', 'teacher5', 'Środa', '12:00', '12:45'),
('1C', 'bio1C', 'teacher7', 'Czwartek', '13:00', '13:45'),
('1C', 'hist1C', 'teacher9', 'Piątek', '08:00', '08:45'),

-- 2A
('2A', 'mat2A', 'teacher1', 'Poniedziałek', '11:00', '11:45'),
('2A', 'fiz2A', 'teacher3', 'Wtorek', '12:00', '12:45'),
('2A', 'chem2A', 'teacher5', 'Środa', '13:00', '13:45'),
('2A', 'bio2A', 'teacher7', 'Czwartek', '08:00', '08:45'),
('2A', 'hist2A', 'teacher9', 'Piątek', '09:00', '09:45');

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
('student1', 5.0, 'mat1A', 'teacher1'),
('student1', 4.0, 'fiz1A', 'teacher3'),
('student1', 3.5, 'chem1A', 'teacher5'),
('student2', 3.0, 'mat1B', 'teacher1'),
('student2', 4.5, 'fiz1B', 'teacher3'),
('student2', 4.0, 'chem1B', 'teacher5'),
('student3', 4.0, 'mat1C', 'teacher1'),
('student3', 3.5, 'fiz1C', 'teacher3'),
('student3', 5.0, 'chem1C', 'teacher5'),
('student4', 4.5, 'mat2A', 'teacher1'),
('student4', 4.0, 'fiz2A', 'teacher3'),
('student4', 3.5, 'chem2A', 'teacher5'),
('student5', 3.5, 'mat2B', 'teacher1'),
('student5', 4.0, 'fiz2B', 'teacher3'),
('student5', 4.5, 'chem2B', 'teacher5'),
('student6', 5.0, 'mat3A', 'teacher2'),
('student6', 4.5, 'fiz3A', 'teacher4'),
('student6', 4.0, 'chem3A', 'teacher6'),
('student7', 3.5, 'mat4A', 'teacher2'),
('student7', 4.0, 'fiz4A', 'teacher4'),
('student7', 4.5, 'chem4A', 'teacher6'),
('student8', 4.0, 'mat4B', 'teacher2'),
('student8', 3.5, 'fiz4B', 'teacher4'),
('student8', 5.0, 'chem4B', 'teacher6'),
('student9', 4.5, 'mat1A', 'teacher1'),
('student9', 4.0, 'fiz1A', 'teacher3'),
('student9', 3.5, 'chem1A', 'teacher5'),
('student10', 3.0, 'mat1B', 'teacher1'),
('student10', 4.5, 'fiz1B', 'teacher3'),
('student10', 4.0, 'chem1B', 'teacher5');
