import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function ensureValidToken(req, res, next) {
  if (!req.session.access_token || !req.session.token_expires_at) {
    return res.redirect('/login');
  }

  if (Date.now() > req.session.token_expires_at - 60 * 1000) {
    try {
      const {
        ADMIN_KEYCLOAK_URL,
        ADMIN_KEYCLOAK_REALM,
        ADMIN_KEYCLOAK_CLIENT_ID,
        ADMIN_KEYCLOAK_CLIENT_SECRET
      } = process.env;

      const tokenEndpoint = `${ADMIN_KEYCLOAK_URL}/realms/${ADMIN_KEYCLOAK_REALM}/protocol/openid-connect/token`;

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
      req.session.token_expires_at = Date.now() + tokenResponse.data.expires_in * 1000;
      await req.session.save();
    } catch (err) {
      console.error('Token refresh failed:', err);
      return res.redirect('/login');
    }
  }
  next();
}