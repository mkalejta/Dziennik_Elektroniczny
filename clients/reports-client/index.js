const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const { appendToSheet, createSheetIfNotExists, clearSheet } = require('./utils/googleSheets');
const express = require('express');
const app = express();


app.use(cors({
  origin: "http://localhost:4000",
  methods: ["POST"]
}));
app.use(express.json());
const PORT = process.env.PORT || 4001;

dotenv.config();

const {
    INTERNAL_URL,
    REALM,
    CLIENT_ID,
    CLIENT_SECRET,
    SHEET_ID,
    API_GATEWAY_URL
} = process.env;

async function getAccessToken() {
  const res = await axios.post(
    `${INTERNAL_URL}/realms/${REALM}/protocol/openid-connect/token`,
    new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  return res.data.access_token;
}

async function fetchClasses(token) {
  const res = await axios.get(`${API_GATEWAY_URL}/classes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // [{id}]
}

async function fetchGradesForStudent(token, studentId) {
  const res = await axios.get(`${API_GATEWAY_URL}/grades/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // { [subject]: [{id, grade, ...}], ... }
  return res.data;
}

async function fetchStudentsInClass(token, classId) {
  const res = await axios.get(`${API_GATEWAY_URL}/classes/${classId}/students`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // [{id, name, surname}]
}

function calculateSubjectAverages(gradesBySubject) {
  const subjectAverages = {};
  for (const [subject, grades] of Object.entries(gradesBySubject)) {
    if (grades.length) {
      const avg = grades.reduce((acc, g) => acc + g.grade, 0) / grades.length;
      subjectAverages[subject] = Number(avg.toFixed(2));
    } else {
      subjectAverages[subject] = null;
    }
  }
  return subjectAverages;
}

function calculateOverallAverage(subjectAverages) {
  const values = Object.values(subjectAverages).filter(v => v !== null && !isNaN(v));
  if (!values.length) return null;
  return Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
}

async function generateReport() {
  const token = await getAccessToken();
  const classes = await fetchClasses(token);

  for (const cls of classes) {
    const classId = cls.id || cls;
    const students = await fetchStudentsInClass(token, classId);

    // Wszystkie przedmioty w tej klasie
    const allSubjectsSet = new Set();
    const studentsData = [];

    for (const student of students) {
      const gradesBySubject = await fetchGradesForStudent(token, student.id || student._id);
      Object.keys(gradesBySubject).forEach(subject => allSubjectsSet.add(subject));
      const subjectAverages = calculateSubjectAverages(gradesBySubject);
      const overallAverage = calculateOverallAverage(subjectAverages);
      studentsData.push({
        name: `${student.name} ${student.surname}`,
        subjectAverages,
        overallAverage
      });
    }

    const allSubjects = Array.from(allSubjectsSet);

    // Przygotuj nagłówki
    const headers = ['Uczeń', ...allSubjects, 'Średnia ogólna'];
    const rows = [headers];

    // Wypełnij wiersze uczniów
    for (const student of studentsData) {
      const row = [student.name];
      for (const subject of allSubjects) {
        row.push(
          student.subjectAverages[subject] !== undefined && student.subjectAverages[subject] !== null
            ? student.subjectAverages[subject]
            : 'Brak ocen'
        );
      }
      row.push(student.overallAverage !== null ? student.overallAverage : 'Brak ocen');
      rows.push(row);
    }

    // Podsumowanie klasowe (średnie z każdego przedmiotu i ogólna)
    const classSubjectAverages = {};
    for (const subject of allSubjects) {
      const subjectValues = studentsData
        .map(s => s.subjectAverages[subject])
        .filter(v => v !== null && v !== undefined && !isNaN(v));
      classSubjectAverages[subject] = subjectValues.length
        ? Number((subjectValues.reduce((a, b) => a + b, 0) / subjectValues.length).toFixed(2))
        : null;
    }
    const classOverallAverage = calculateOverallAverage(classSubjectAverages);

    const summaryRow = ['Średnia klasy'];
    for (const subject of allSubjects) {
      summaryRow.push(
        classSubjectAverages[subject] !== null ? classSubjectAverages[subject] : 'Brak ocen'
      );
    }
    summaryRow.push(classOverallAverage !== null ? classOverallAverage : 'Brak ocen');
    rows.push(summaryRow);

    // Utwórz/wyczyść arkusz dla klasy i zapisz dane
    const sheetTitle = `Klasa ${classId}`;
    await createSheetIfNotExists(SHEET_ID, sheetTitle);
    await clearSheet(SHEET_ID, sheetTitle);
    await appendToSheet(SHEET_ID, rows, sheetTitle);
  }
}

app.post('/api/reports', async (req, res) => {
  try {
    await generateReport();
    res.status(200).send('Raport wygenerowany!');
  } catch (err) {
    res.status(500).send('Błąd generowania raportu: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Reports-client listening on port ${PORT}`);
});
