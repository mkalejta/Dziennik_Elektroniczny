const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const {
  KEYCLOAK_INTERNAL_URL,
  KEYCLOAK_REALM
} = process.env;

async function checkJwt(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(' ')[1];

  try {
      const { data } = await axios.get(`${KEYCLOAK_INTERNAL_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`);
      const publicKey = data.keys[1].x5c[0];
      const cert = `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`;

      jwt.verify(token, cert, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) return res.status(403).json({ error: "Invalid token" });
          req.user = decoded;
          next();
      });
  } catch (err) {
      console.error("Error verifying token:", err);
      res.status(500).json({ error: "Error verifying token" });
  }
}

module.exports = checkJwt;
