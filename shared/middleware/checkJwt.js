const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const {
  KEYCLOAK_INTERNAL_URL,
  KEYCLOAK_REALM
} = process.env;

function getKidFromJWT(token) {
  try {
    const [headerB64] = token.split('.');
    if (!headerB64) throw new Error("Invalid token format");
    const headerJson = Buffer.from(headerB64, 'base64').toString('utf8');
    const header = JSON.parse(headerJson);
    return header.kid;
  } catch (err) {
    throw new Error("Failed to extract kid from token");
  }
}

async function checkJwt(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(' ')[1];

  try {
      const { data } = await axios.get(`${KEYCLOAK_INTERNAL_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`);
      let kid;
      try {
        kid = getKidFromJWT(token);
      } catch (err) {
        return res.status(400).json({ error: "Invalid token format" });
      }
      const publicKey = data.keys.filter(key => key.kid === kid)[0].x5c[0];
      const cert = `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`;

      jwt.verify(token, cert, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) return res.status(403).json({ error: "Invalid token" });
          req.user = decoded;
          return next();
      });
  } catch (err) {
      console.error("Error verifying token:", err);
      res.status(500).json({ error: "Error verifying token" });
  }
}

module.exports = checkJwt;
