const axios = require('axios');

const API_GATEWAY_URL = process.env.ADMIN_API_GATEWAY_URL;

const getUsers = async (req, res) => {
  try {
    const accessToken = req.session.access_token;
    const users = await axios.get(`${API_GATEWAY_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const classes = await axios.get(`${API_GATEWAY_URL}/classes`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const subjects = await axios.get(`${API_GATEWAY_URL}/subjects`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).then(res => [...new Set(res.data.map(subject => subject.name))]);
    res.render('users', { users: users.data, classes: classes.data, subjects });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function getUserById(req, res) {
  const userId = req.params.id;
  try {
    const accessToken = req.session.access_token;
    const user = await axios.get(`${API_GATEWAY_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(200).json(user.data);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createUser(req, res) {
  const userData = req.body;
  try {
    const accessToken = req.session.access_token;
    const newUser = await axios.post(`${API_GATEWAY_URL}/users`, userData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(201).json(newUser.data);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  try {
    const accessToken = req.session.access_token;
    await axios.delete(`${API_GATEWAY_URL}/users/${userId}`,  {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser
};
