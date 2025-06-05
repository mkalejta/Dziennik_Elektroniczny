const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const ensureValidToken = async (req, res, next) => {
  if (!req.session.access_token || !req.session.token_expires_at) {
    return res.redirect('/login');
  }

  if (Date.now() > req.session.token_expires_at - 60 * 1000) {
    try {
      const {
        KEYCLOAK_INTERNAL_URL,
        ADMIN_KEYCLOAK_REALM,
        ADMIN_KEYCLOAK_CLIENT_ID,
        ADMIN_KEYCLOAK_CLIENT_SECRET
      } = process.env;

      const tokenEndpoint = `${KEYCLOAK_INTERNAL_URL}/realms/${ADMIN_KEYCLOAK_REALM}/protocol/openid-connect/token`;

      const tokenResponse = await axios.post(tokenEndpoint, new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: ADMIN_KEYCLOAK_CLIENT_ID,
        client_secret: ADMIN_KEYCLOAK_CLIENT_SECRET,
        refresh_token: req.session.refresh_token
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      req.session.access_token = tokenResponse.data.access_token;
      req.session.refresh_token = tokenResponse.data.refresh_token;
      req.session.id_token = tokenResponse.data.id_token; 
      req.session.token_expires_at = Date.now() + tokenResponse.data.expires_in * 1000;
      await req.session.save();

      req.session.user = jwt.decode(req.session.access_token);
      
    } catch (err) {
      console.error('Token refresh failed:', err);
      return res.redirect('/login');
    }
  } else {
    try {
      req.session.user = jwt.decode(req.session.access_token);
    } catch (err) {
      console.error('JWT decode failed:', err);
      return res.redirect('/login');
    }
  }
  next();
}

module.exports = { ensureValidToken };