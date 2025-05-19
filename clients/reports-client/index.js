const axios = require('axios');
const dotenv = require('dotenv');
const { appendToSheet } = require('./utils/googleSheets');

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
  const res = await axios.get(`${API_GATEWAY_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // zakładamy [{id, name, students: [...] }]
}

async function fetchGradesForStudent(token, studentId) {
  const res = await axios.get(`${API_GATEWAY_URL}/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data; // zakładamy [{subject, grade}]
}

async function calculateAverage(grades) {
  if (!grades.length) return null;
  const sum = grades.reduce((acc, g) => acc + g.grade, 0);
  return (sum / grades.length).toFixed(2);
}

async function generateReport() {
  const token = await getAccessToken();
  const classes = await fetchClasses(token);

  const rows = [['Klasa', 'Uczeń', 'Średnia ocen']];

  for (const cls of classes) {
    for (const student of cls.students) {
      const grades = await fetchGradesForStudent(token, student.id);
      const avg = await calculateAverage(grades);
      rows.push([cls.name, `${student.firstName} ${student.lastName}`, avg || 'Brak ocen']);
    }
  }

  await appendToSheet(SHEET_ID, rows);
}

generateReport().catch(err => {
  console.error('Błąd podczas generowania raportu:', err.message);
});
