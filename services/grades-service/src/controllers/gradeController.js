const pgClient = require('../db/pgClient');

// Funkcja walidująca dane oceny
function validateGradeData(gradeData) {
    if (!gradeData.studentId || typeof gradeData.studentId !== 'string') {
        throw new Error('Invalid or missing "studentId"');
    }
    if (gradeData.grade === undefined || typeof gradeData.grade !== 'number') {
        throw new Error('Invalid or missing "grade"');
    }
    if (gradeData.grade < 1 || gradeData.grade > 6) {
        throw new Error('Grade must be between 1 and 6');
    }
    if (!gradeData.subjectId || typeof gradeData.subjectId !== 'string') {
        throw new Error('Invalid or missing "subjectId"');
    }
    if (!gradeData.teacherId || typeof gradeData.teacherId !== 'string') {
        throw new Error('Invalid or missing "teacherId"');
    }
}


async function getAllGrades(req, res) {
    try {
        const result = await pgClient.query('SELECT * FROM grades');
        res.json(result.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu ocen:', error);
        res.status(500).send('Internal server error');
    }
}

async function createGrade(req, res) {
    const gradeData = req.body;

    try {
        validateGradeData(gradeData);

        const result = await pgClient.query(
            `INSERT INTO grades (student_id, grade, subject_id, teacher_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [gradeData.studentId, gradeData.grade, gradeData.subjectId, gradeData.teacherId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy tworzeniu oceny:', error);
        res.status(400).send(error.message);
    }
}

async function getGradeById(req, res) {
    const gradeId = req.params.gradeId;

    try {
        const result = await pgClient.query(
            `SELECT * FROM grades WHERE id = $1`,
            [gradeId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Grade not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy pobieraniu oceny:', error);
        res.status(500).send('Internal server error');
    }
}

async function updateGrade(req, res) {
    const gradeId = req.params.gradeId;
    const gradeData = req.body;

    try {
        validateGradeData(gradeData);

        const result = await pgClient.query(
            `UPDATE grades SET student_id = $1, grade = $2, subject_id = $3, teacher_id = $4 
             WHERE id = $5 RETURNING *`,
            [gradeData.studentId, gradeData.grade, gradeData.subjectId, gradeData.teacherId, gradeId]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Grade not found');
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Błąd przy aktualizacji oceny:', error);
        res.status(400).send(error.message);
    }
}

async function deleteGrade(req, res) {
    const gradeId = req.params.gradeId;

    try {
        const result = await pgClient.query('DELETE FROM grades WHERE id = $1', [gradeId]);

        if (result.rowCount === 0) {
            return res.status(404).send('Grade not found');
        }

        res.status(204).send();
    } catch (error) {
        console.error('Błąd przy usuwaniu oceny:', error);
        res.status(500).send('Internal server error');
    }
}

async function getGradesByStudentId(req, res) {
    const studentId = req.params.studentId;

    try {
        const gradesResult = await pgClient.query(
            `SELECT * FROM grades WHERE student_id = $1`,
            [studentId]
        );

        if (gradesResult.rowCount === 0) {
            return res.json([]);
        }

        const db = req.app.locals.db;
        const result = await convertGrades(gradesResult, db);

        res.json(result);
    } catch (error) {
        console.error('Błąd przy pobieraniu ocen:', error);
        res.status(500).send('Internal server error');
    }
}

async function getGradesByParentId(req, res) {
    try {
        const db = req.app.locals.db;
        const parentId = req.params.parentId;

        const parentChild = await db.collection('parent_child').find({ parentId }).toArray();
        const childIds = parentChild.map(pc => pc.childId);

        const childId = childIds[0];

        if (!childId) {
            return res.status(404).send('No children found for this parent');
        }

        const gradesResult = await pgClient.query(
            `SELECT * FROM grades WHERE student_id = $1`,
            [childId]
        );

        if (gradesResult.rowCount === 0) {
            return res.json([]);
        }

        const result = await convertGrades(gradesResult, db);

        res.json(result);
    } catch (error) {
        console.error('Błąd przy pobieraniu ocen:', error);
        res.status(500).send('Internal server error');
    }
}

async function getGradesByStudentIdAndSubjectId(req, res) {
    const studentId = req.params.studentId;
    const subjectId = req.params.subjectId;

    try {
        const gradesResult = await pgClient.query(
            `SELECT * FROM grades WHERE student_id = $1 AND subject_id = $2`,
            [studentId, subjectId]
        );      

        res.json(gradesResult.rows);
    } catch (error) {
        console.error('Błąd przy pobieraniu ocen:', error);
        res.status(500).send('Internal server error');
    }
}

async function convertGrades(gradesResult, db) {
    const subjectsResult = await pgClient.query(`SELECT * FROM subjects`);
    const subjectsMap = new Map(subjectsResult.rows.map(s => [s.id, s.name]));

    const result = await Promise.all(
        gradesResult.rows.map(async (grade) => {
            const teacher = await db.collection('users').findOne({ _id: grade.teacher_id });
            return {
                id: grade.id,
                grade: grade.grade,
                subject: subjectsMap.get(grade.subject_id) || null,
                teacher: teacher.name || null
            };
        })
    );

    // Grupowanie ocen według przedmiotów
    const groupedGrades = result?.reduce((acc, grade) => {
        if (!acc[grade.subject]) {
            acc[grade.subject] = [];
        }
        acc[grade.subject].push(grade);
        return acc;
    }, {});

    return groupedGrades;
}

async function getGradesByTeacherIdGroupedByClass(req, res) {
    const teacherId = req.params.teacherId;

    try {
        const db = req.app.locals.db;

        // Pobierz przedmioty prowadzone przez nauczyciela
        const subjectsResult = await pgClient.query(
            `SELECT id, class_id FROM subjects WHERE teacher_id = $1`,
            [teacherId]
        );

        const subjects = subjectsResult.rows;

        if (subjects.length === 0) {
            return res.json({});
        }

        // Mapowanie przedmiotów na klasy
        const classSubjectMap = subjects.reduce((acc, subject) => {
            if (!acc[subject.class_id]) {
                acc[subject.class_id] = [];
            }
            acc[subject.class_id].push(subject.id);
            return acc;
        }, {});

        // Pobierz wszystkich uczniów przypisanych do klas prowadzonych przez nauczyciela
        const classIds = Object.keys(classSubjectMap);
        const studentsClassesResult = await pgClient.query(
            `SELECT student_id, class_id FROM students_classes WHERE class_id = ANY($1)`,
            [classIds]
        );

        const studentsClasses = studentsClassesResult.rows;

        // Pobierz dane uczniów z MongoDB na podstawie student_id
        const studentIds = [...new Set(studentsClasses.map((sc) => sc.student_id))];
        const students = await db
            .collection("users")
            .find({ _id: { $in: studentIds } })
            .toArray();

        // Pobierz oceny dla przedmiotów prowadzonych przez nauczyciela
        const gradesResult = await pgClient.query(
            `SELECT g.student_id, g.grade, g.subject_id, s.class_id
             FROM grades g
             JOIN subjects s ON g.subject_id = s.id
             WHERE s.teacher_id = $1`,
            [teacherId]
        );

        const grades = gradesResult.rows;

        // Grupowanie uczniów według klas
        const groupedData = classIds.reduce((acc, classId) => {
            acc[classId] = studentsClasses
                .filter((sc) => sc.class_id === classId)
                .map((sc) => {
                    const student = students.find((s) => s._id === sc.student_id);
                    return {
                        id: student?._id,
                        name: student?.name,
                        surname: student?.surname,
                        grades: [], // Domyślnie pusta tablica ocen
                    };
                });
            return acc;
        }, {});

        // Dopasowanie ocen do uczniów
        grades.forEach((grade) => {
            const classData = groupedData[grade.class_id];
            if (!classData) return;

            const studentData = classData.find((student) => student.id === grade.student_id);
            if (!studentData) return;

            // Dodaj ocenę tylko dla przedmiotów prowadzonych przez nauczyciela
            if (classSubjectMap[grade.class_id].includes(grade.subject_id)) {
                studentData.grades.push(grade.grade);
            }
        });

        res.json(groupedData);
    } catch (error) {
        console.error("Błąd przy pobieraniu ocen nauczyciela:", error);
        res.status(500).send("Internal server error");
    }
}

module.exports = {
    getAllGrades,
    createGrade,
    getGradeById,
    updateGrade,
    deleteGrade,
    getGradesByStudentId,
    getGradesByParentId,
    getGradesByStudentIdAndSubjectId,
    getGradesByTeacherIdGroupedByClass,
};
