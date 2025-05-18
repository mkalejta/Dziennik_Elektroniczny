const axios = require('axios');

const API_GATEWAY_URL = process.env.ADMIN_API_GATEWAY_URL;

const getLessons = async (req, res) => {
  try {
    const accessToken = req.session.access_token;
    const timetable = await axios.get(`${API_GATEWAY_URL}/timetable`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const classes = await axios.get(`${API_GATEWAY_URL}/classes`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const teachers = await axios.get(`${API_GATEWAY_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.data.filter(user => user.role === 'teacher');
    });
    const subjects = await axios.get(`${API_GATEWAY_URL}/subjects`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log('Timetable:', timetable.data);
    console.log('Classes:', classes.data);
    console.log('Teachers:', teachers);
    console.log('Subjects:', subjects.data);
    res.render('timetable', {
      timetable: timetable.data, 
      classes: classes.data,
      teachers: teachers,
      subjects: subjects.data
    });
  } catch (error) {
    console.error('Error fetching timetable:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createLesson = async (req, res) => {
  const lessonData = req.body;
  try {
    const accessToken = req.session.access_token;
    const newLesson = await axios.post(`${API_GATEWAY_URL}/timetable`, lessonData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(201).json(newLesson.data);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getLessonById = async (req, res) => {
  const { id } = req.params;
  try {
    const accessToken = req.session.access_token;
    const lesson = await axios.get(`${API_GATEWAY_URL}/timetable/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(200).json(lesson.data);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateLesson = async (req, res) => {
  const { id } = req.params;
  const lessonData = req.body;
  try {
    const accessToken = req.session.access_token;
    const updatedLesson = await axios.put(`${API_GATEWAY_URL}/timetable/${id}`, lessonData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(200).json(updatedLesson.data);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteLesson = async (req, res) => {
  const { id } = req.params;
  try {
    const accessToken = req.session.access_token;
    await axios.delete(`${API_GATEWAY_URL}/timetable/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getLessonByClassId = async (req, res) => {
  const { classId } = req.params;
  try {
    const accessToken = req.session.access_token;
    const lesson = await axios.get(`${API_GATEWAY_URL}/timetable/class/${classId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(200).json(lesson.data);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getLessonByTeacherId = async (req, res) => {
  const { teacherId } = req.params;
  try {
    const accessToken = req.session.access_token;
    const lesson = await axios.get(`${API_GATEWAY_URL}/timetable/teacher/${teacherId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(200).json(lesson.data);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getLessons,
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLessonByClassId,
  getLessonByTeacherId
};