import axios from 'axios';

const API_GATEWAY_URL = process.env.ADMIN_API_GATEWAY_URL;

const getUsers = async (req, res) => {
  try {
    const users = await axios.get(`${API_GATEWAY_URL}/users`);
    res.status(200).json(users.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getUsers };
