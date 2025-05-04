db = db.getSiblingDB('gradebookDB');

// Funkcja do generowania losowych haseł
function generatePassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Listy imion i nazwisk
const maleFirstNames = ['Jan', 'Piotr', 'Michał', 'Krzysztof', 'Tomasz', 'Paweł', 'Adam', 'Marcin', 'Łukasz', 'Mateusz'];
const femaleFirstNames = ['Anna', 'Katarzyna', 'Maria', 'Magdalena', 'Joanna', 'Agnieszka', 'Ewa', 'Monika', 'Barbara', 'Aleksandra'];
const lastNames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak'];

// Funkcja do generowania losowego imienia i nazwiska
function generateFullName(isMale) {
  const firstName = isMale
    ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
    : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
  let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  // Jeśli użytkownik jest kobietą i nazwisko kończy się na "ski", zmień końcówkę na "ska"
  if (!isMale && lastName.endsWith('ski')) {
    lastName = lastName.slice(0, -1) + 'a';
  }

  return `${firstName} ${lastName}`;
}

// USERS COLLECTION
db.createCollection('users');

// Admin
db.users.insertOne({
  _id: 'admin1', // Ustalony ID dla admina
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  password: generatePassword(),
  createdAt: new Date(),
});

// Students
const students = [];
for (let i = 1; i <= 40; i++) {
  const isMale = i <= 20; // Pierwsza połowa to mężczyźni, druga połowa to kobiety
  students.push({
    _id: `student${i}`, // Ustalony ID dla studentów
    name: generateFullName(isMale),
    email: `student${i}@example.com`,
    role: 'student',
    password: generatePassword(),
    createdAt: new Date(),
  });
}
db.users.insertMany(students);

// Parents
const parents = [];
for (let i = 1; i <= 40; i++) {
  const isMale = i <= 20; // Pierwsza połowa to mężczyźni, druga połowa to kobiety
  parents.push({
    _id: `parent${i}`, // Ustalony ID dla rodziców
    name: generateFullName(isMale),
    email: `parent${i}@example.com`,
    role: 'parent',
    password: generatePassword(),
    createdAt: new Date(),
  });
}
db.users.insertMany(parents);

// Teachers
const teachers = [];
for (let i = 1; i <= 12; i++) {
  const isMale = i <= 6; // Pierwsza połowa to mężczyźni, druga połowa to kobiety
  teachers.push({
    _id: `teacher${i}`, // Ustalony ID dla nauczycieli
    name: generateFullName(isMale),
    email: `teacher${i}@example.com`,
    role: 'teacher',
    password: generatePassword(),
    createdAt: new Date(),
  });
}
db.users.insertMany(teachers);

// ATTENDANCE COLLECTION
db.createCollection('attendance');
db.attendance.insertMany([
  {
    teacherId: teachers[0]._id,
    students: [students[0]._id, students[1]._id],
    date: new Date(),
    subjectId: 'math',
  },
  {
    teacherId: teachers[1]._id,
    students: [students[2]._id, students[3]._id],
    date: new Date(),
    subjectId: 'physics',
  },
]);

// MESSAGES COLLECTION
db.createCollection('messages');
db.messages.insertMany([
  {
    teacherId: teachers[0]._id,
    parentId: parents[0]._id,
    messages: [
      {
        author: teachers[0]._id,
        content: 'Your child is doing great!',
        sent: new Date(),
      },
      {
        author: parents[0]._id,
        content: 'Thank you for the update!',
        sent: new Date(),
      },
    ],
  },
  {
    teacherId: teachers[1]._id,
    parentId: parents[1]._id,
    messages: [
      {
        author: teachers[1]._id,
        content: 'Your child needs to improve in math.',
        sent: new Date(),
      },
    ],
  },
]);

