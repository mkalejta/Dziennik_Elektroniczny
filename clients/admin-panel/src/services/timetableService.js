import axios from 'axios';

const API_GATEWAY_URL = process.env.ADMIN_API_GATEWAY_URL;

const getLessons = async (req, res) => {
  try {
    const lessons = await axios.get(`${API_GATEWAY_URL}/timetable`);
    res.status(200).json(lessons.data);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getLessons };